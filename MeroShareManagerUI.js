/**
 * MeroShare UI Server - Manage encrypted accounts and view application history
 * Author: [Your Name]
 */

const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
require("dotenv").config();

const app = express();
const PORT = 3000;
const accountsPath = path.join(__dirname, "accounts.json");
const historyPath = path.join(__dirname, "history.json");

const ENCRYPTION_KEY = crypto.createHash("sha256").update(process.env.SECRET_KEY).digest();
const IV_LENGTH = 16;

/**
 * Encrypts plain text using AES-256-CBC
 * @param {string} text
 * @returns {string} encryptedText in 'iv:encrypted' format
 */
function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

/**
 * Decrypts text encrypted in 'iv:encrypted' format
 * @param {string} text
 * @returns {string} plain text
 */
function decrypt(text) {
  const [ivHex, encryptedText] = text.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

app.use(express.static("public"));
app.use(express.json());

/**
 * POST /add-account
 * Adds a new encrypted account to accounts.json
 */
app.post("/add-account", (req, res) => {
  const { fullname, boid, dpId, username, password, crnNumber, pin } = req.body;
  if (!fullname || !boid || !dpId || !username || !password || !crnNumber || !pin) {
    return res.status(400).send("All fields are required.");
  }

  const newAccount = {
    fullname,
    boid,
    dpId,
    username,
    password: encrypt(password),
    crnNumber: encrypt(crnNumber),
    pin: encrypt(pin),
  };

  const accounts = fs.existsSync(accountsPath)
    ? JSON.parse(fs.readFileSync(accountsPath, "utf8"))
    : [];

  accounts.push(newAccount);
  fs.writeFileSync(accountsPath, JSON.stringify(accounts, null, 2), "utf8");

  res.send("✅ Encrypted account saved.");
});

/**
 * GET /accounts
 * Returns decrypted list of saved accounts
 */
app.get("/accounts", (req, res) => {
  try {
    const raw = fs.existsSync(accountsPath)
      ? JSON.parse(fs.readFileSync(accountsPath, "utf8"))
      : [];

    const accounts = raw.map(acc => ({
      fullname: acc.fullname,
      boid: acc.boid,
      dpId: acc.dpId,
      username: acc.username,
      password: decrypt(acc.password),
      crnNumber: decrypt(acc.crnNumber),
      pin: decrypt(acc.pin),
    }));

    res.json(accounts);
  } catch (err) {
    console.error("Error decrypting accounts:", err);
    res.status(500).send("Failed to load accounts.");
  }
});

/**
 * DELETE /delete-account/:index
 * Deletes account by index
 */
app.delete("/delete-account/:index", (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const accounts = fs.existsSync(accountsPath)
      ? JSON.parse(fs.readFileSync(accountsPath, "utf8"))
      : [];

    if (index < 0 || index >= accounts.length) {
      return res.status(400).send("Invalid account index.");
    }

    accounts.splice(index, 1);
    fs.writeFileSync(accountsPath, JSON.stringify(accounts, null, 2), "utf8");
    res.send("🗑️ Account deleted successfully.");
  } catch (err) {
    console.error("Error deleting account:", err);
    res.status(500).send("Failed to delete account.");
  }
});

/**
 * GET /history
 * Returns application history
 */
app.get("/history", (req, res) => {
  try {
    if (!fs.existsSync(historyPath)) return res.json([]);

    const data = fs.readFileSync(historyPath);
    const history = JSON.parse(data);
    res.json(history);
  } catch (err) {
    console.error("Error reading history.json:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`🌐 UI server running at http://localhost:${PORT}`);
});
