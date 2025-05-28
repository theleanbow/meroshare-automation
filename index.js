const puppeteer = require("puppeteer");
const axios = require("axios");
require("dotenv").config();

/**
 * MeroShare Automation Service
 * Automates the process of applying for shares on MeroShare platform
 */
class MeroShareAutomation {
  constructor(credentials) {
    this.config = {
      baseURL: "https://webbackend.cdsc.com.np/api/meroShare",
      frontendURL: "https://meroshare.cdsc.com.np",
      timeout: 30000,
      retryAttempts: 3,
      defaultDelay: 1000
    };

    this.credentials = credentials;

    this.validateCredentials();
  }

  /**
   * Validates required environment variables
   */
  validateCredentials() {
    // console.log(process.env);
    const required = ['dpId', 'username', 'password', 'crnNumber', 'pin'];
    const missing = required.filter(key => !this.credentials[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required credentials: ${missing.join(', ')}`);
    }
  }

  /**
   * Creates delay for specified milliseconds
   * @param {number} ms - Milliseconds to delay
   */
  delay(ms = this.config.defaultDelay) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Creates HTTP headers for API requests
   * @param {string} authorization - Authorization token
   */
  getHeaders(authorization = null) {
    return {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
      ...(authorization && { authorization }),
      "content-type": "application/json",
      "sec-ch-ua": '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      Referer: this.config.frontendURL,
      "Referrer-Policy": "strict-origin-when-cross-origin",
    };
  }

  /**
   * Fetches the first available company share ID
   * @param {string} authorization - Authorization token
   * @returns {Promise<string>} Company share ID
   */
  async fetchFirstCompanyShareId(authorization) {
    try {
      const url = `${this.config.baseURL}/companyShare/applicableIssue/`;
      const payload = {
        filterFieldParams: [
          { key: "companyIssue.companyISIN.script", alias: "Scrip" },
          { key: "companyIssue.companyISIN.company.name", alias: "Company Name" },
          { key: "companyIssue.assignedToClient.name", value: "", alias: "Issue Manager" },
        ],
        page: 1,
        size: 10,
        searchRoleViewConstants: "VIEW_APPLICABLE_SHARE",
        filterDateParams: [
          { key: "minIssueOpenDate", condition: "", alias: "", value: "" },
          { key: "maxIssueCloseDate", condition: "", alias: "", value: "" },
        ],
      };

      const response = await axios.post(url, payload, {
        headers: this.getHeaders(authorization),
        timeout: this.config.timeout
      });

      if (!response.data?.object?.length) {
        throw new Error('No applicable shares found');
      }

      console.log(`Found ${response.data.object.length} applicable shares`);
      return response.data.object[0].companyShareId;
    } catch (error) {
      console.error("Error fetching company share ID:", error.message);
      throw error;
    }
  }

  /**
   * Fetches the first available bank ID
   * @param {string} authorization - Authorization token
   * @returns {Promise<string>} Bank ID
   */
  async getFirstBankId(authorization) {
    try {
      const url = `${this.config.baseURL}/bank/`;
      const response = await axios.get(url, {
        headers: this.getHeaders(authorization),
        timeout: this.config.timeout
      });

      if (!response.data?.length) {
        throw new Error('No banks found');
      }

      console.log(`Found ${response.data.length} banks`);
      return response.data[0].id;
    } catch (error) {
      console.error("Error fetching bank ID:", error.message);
      throw error;
    }
  }

  /**
   * Gets DP name by ID
   * @param {string} dpId - DP ID
   * @returns {Promise<string>} DP name
   */
  async getDpNameById(dpId) {
    try {
      const url = `${this.config.baseURL}/capital/`;
      const response = await axios.get(url, {
        headers: this.getHeaders(),
        timeout: this.config.timeout
      });

      const dp = response.data.find(item => item.code.toString() === dpId.toString());
      
      if (!dp) {
        throw new Error(`DP with ID ${dpId} not found`);
      }

      console.log(`Found DP: ${dp.name}`);
      return dp.name;
    } catch (error) {
      console.error("Error fetching DP name:", error.message);
      throw error;
    }
  }

  /**
   * Performs login to MeroShare platform
   * @param {puppeteer.Page} page - Puppeteer page instance
   * @param {string} dpName - DP name
   */
  async performLogin(page, dpName) {
    console.log("Starting login process...");

    // Navigate to login page
    await page.goto(this.config.frontendURL, { waitUntil: "domcontentloaded" });

    // Select DP
    await page.waitForSelector(".select2-selection", { visible: true });
    await page.click(".select2-selection");
    
    await page.waitForSelector(".select2-search__field", { visible: true });
    await page.type(".select2-search__field", dpName);
    await page.keyboard.press("Enter");

    // Enter credentials
    await page.type("#username", this.credentials.username, { delay: 100 });
    await this.delay(500);

    await page.type("#password", this.credentials.password, { delay: 100 });
    await this.delay(500);

    // Submit login
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: "networkidle2" });

    console.log("Login successful!");
  }

  /**
   * Extracts authorization token from session storage
   * @param {puppeteer.Page} page - Puppeteer page instance
   * @returns {Promise<string>} Authorization token
   */
  async getAuthorizationToken(page) {
    await page.goto(`${this.config.frontendURL}/#/asba`, { waitUntil: "networkidle2" });
    
    const authToken = await page.evaluate(() => {
      return window.sessionStorage.getItem("Authorization");
    });

    if (!authToken) {
      throw new Error("Failed to retrieve authorization token");
    }

    return authToken;
  }

  /**
   * Fills the share application form
   * @param {puppeteer.Page} page - Puppeteer page instance
   * @param {string} companyShareId - Company share ID
   * @param {string} bankId - Bank ID
   */
  async fillApplicationForm(page, companyShareId, bankId) {
    console.log("Filling application form...");

    // Navigate to application page
    await page.goto(`${this.config.frontendURL}/#/asba/apply/${companyShareId}`, {
      waitUntil: "domcontentloaded"
    });

    // Select bank
    await page.waitForSelector("#selectBank");
    await page.select("#selectBank", bankId.toString());
    await this.delay();

    // Wait for and select account number
    await page.waitForSelector("#accountNumber");
    await page.waitForFunction(() => {
      const select = document.querySelector("#accountNumber");
      return select && select.options.length > 1 && select.options[1].value !== "";
    });

    const secondOptionValue = await page.$eval(
      "#accountNumber option:nth-child(2)",
      option => option.value
    );
    await page.select("#accountNumber", secondOptionValue);
    await this.delay();

    // Fill application details
    await page.type("#appliedKitta", "10");
    await this.delay();

    await page.type("#crnNumber", this.credentials.crnNumber, { delay: 250 });
    await this.delay();

    // Accept disclaimer
    await page.waitForSelector("#disclaimer");
    await page.click("#disclaimer");

    // Wait for proceed button to be enabled and click
    await page.waitForFunction(() => {
      const btn = document.querySelector('button[type="submit"]');
      return btn && !btn.disabled;
    });
    await page.click('button[type="submit"]');
  }

  /**
   * Completes the application with PIN
   * @param {puppeteer.Page} page - Puppeteer page instance
   */
  async completeApplication(page) {
    console.log("Completing application with PIN...");

    // Enter PIN
    await page.waitForSelector("#transactionPIN");
    await this.delay();
    await page.type("#transactionPIN", this.credentials.pin, { delay: 250 });

    // Additional delay after PIN entry to allow validation
    await this.delay(2000);

    // Try multiple strategies to click the Apply button
    try {
      // Strategy 1: Wait for button to be enabled (original approach)
      await page.waitForFunction(() => {
        const applyBtn = document.querySelector('button[type="submit"]:not([disabled])');
        return applyBtn !== null;
      }, { timeout: 10000 });

      await page.click('button[type="submit"]');
      console.log("Application submitted successfully!");
      
    } catch (error) {
      console.log("First strategy failed, trying alternative approaches...");
      
      // Strategy 2: Look for the specific Apply button with span text
      try {
        await page.waitForSelector('button[type="submit"] span', { timeout: 5000 });
        const applyButton = await page.$('button[type="submit"] span');
        if (applyButton) {
          const buttonText = await page.evaluate(el => el.textContent.trim(), applyButton);
          if (buttonText === 'Apply') {
            await page.click('button[type="submit"]');
            console.log("Application submitted successfully using strategy 2!");
            return;
          }
        }
      } catch (e) {
        console.log("Strategy 2 failed, trying strategy 3...");
      }

      // Strategy 3: Force click using JavaScript
      try {
        await page.evaluate(() => {
          const buttons = document.querySelectorAll('button[type="submit"]');
          for (let button of buttons) {
            const span = button.querySelector('span');
            if (span && span.textContent.trim() === 'Apply') {
              button.click();
              return;
            }
          }
        });
        console.log("Application submitted successfully using strategy 3!");
        
      } catch (e) {
        console.log("Strategy 3 failed, trying strategy 4...");
        
        // Strategy 4: Wait longer and try again
        await this.delay(3000);
        await page.click('button[type="submit"]');
        console.log("Application submitted successfully using strategy 4!");
      }
    }

    // Wait a bit to see if there's any response or error message
    await this.delay(2000);
    
    // Check for any error messages or success confirmations
    try {
      const errorMessage = await page.$eval('.alert-danger', el => el.textContent);
      if (errorMessage) {
        console.error("Application error:", errorMessage);
      }
    } catch (e) {
      // No error message found, which is good
    }

    try {
      const successMessage = await page.$eval('.alert-success', el => el.textContent);
      if (successMessage) {
        console.log("Success message:", successMessage);
      }
    } catch (e) {
      // No success message found
    }
  }

  /**
   * Main execution method
   */
  async execute() {
    let browser = null;
    
    try {
      console.log("Starting MeroShare automation...");

      // Get DP name
      const dpName = await this.getDpNameById(this.credentials.dpId);

      // Launch browser
      browser = await puppeteer.launch({ 
        headless: false,
         args: ['--no-sandbox', '--disable-setuid-sandbox','--start-maximized'],
        defaultViewport:null // Needed to apply --start-maximized properly
        
      });
      const page = await browser.newPage();

      // Set viewport and user agent
      await page.setViewport({ width: 1366, height: 768 });
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

      // Perform login
      await this.performLogin(page, dpName);

      // Get authorization token
      const authToken = await this.getAuthorizationToken(page);

      // Fetch required IDs
      const [companyShareId, bankId] = await Promise.all([
        this.fetchFirstCompanyShareId(authToken),
        this.getFirstBankId(authToken)
      ]);

      console.log(`Using Company Share ID: ${companyShareId}, Bank ID: ${bankId}`);

      // Fill and submit application
      await this.fillApplicationForm(page, companyShareId, bankId);
      await this.completeApplication(page);

      console.log("MeroShare automation completed successfully!");

    } catch (error) {
      console.error("Automation failed:", error.message);
      throw error;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}

// Export the class for potential reuse
module.exports = MeroShareAutomation;

const fs = require("fs");
const path = require("path");

if (require.main === module) {
  const accountsPath = path.join(__dirname, "accounts.json");

  if (!fs.existsSync(accountsPath)) {
    console.error("accounts.json file not found!");
    process.exit(1);
  }

  const accounts = JSON.parse(fs.readFileSync(accountsPath, "utf-8"));

  (async () => {
    for (const [index, credentials] of accounts.entries()) {
      console.log(`\n🔁 Starting automation for Account #${index + 1} (${credentials.username})`);
      
      const automation = new MeroShareAutomation(credentials);

      try {
        await automation.execute();
      } catch (error) {
        console.error(`❌ Failed for ${credentials.username}:`, error.message);
      }
    }

    console.log("\n✅ All accounts processed.");
  })();
}
