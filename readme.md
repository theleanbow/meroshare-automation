# MeroShare Automation 🚀

An automated tool for applying to Initial Public Offerings (IPOs) on the MeroShare platform in Nepal. This project aims to simplify the share application process through browser automation.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2014.0.0-brightgreen)](https://nodejs.org/)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/yourusername/meroshare-automation/issues)

## ⚠️ Disclaimer

This tool is for educational purposes only. Use at your own risk. The developers are not responsible for any financial losses or account issues that may arise from using this automation tool. Always verify your applications manually.

## ✨ Features

- **Multi-Account Support**: Process multiple MeroShare accounts sequentially
- **Automated Login**: Seamlessly logs into your MeroShare account
- **Smart Share Selection**: Automatically selects the first available IPO
- **Bank Integration**: Automatically selects your preferred bank account
- **Form Automation**: Fills all required application forms
- **Error Handling**: Comprehensive error handling and validation
- **Configurable**: Easy configuration through JSON file
- **Professional Code**: Clean, maintainable, and well-documented codebase

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 14.0.0 or higher)
- **npm** or **yarn**
- A valid MeroShare account
- Google Chrome browser (for Puppeteer)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/anishjoshi1999/meroshare-automation.git
   cd meroshare-automation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure your accounts**
   Create an `accounts.json` file with your account details:
   ```json
   [
     {
       "dpId": "your_dp_id_1",
       "username": "your_username_1",
       "password": "your_password_1",
       "crnNumber": "your_crn_number_1",
       "pin": "your_pin_1"
     },
     {
       "dpId": "your_dp_id_2",
       "username": "your_username_2",
       "password": "your_password_2",
       "crnNumber": "your_crn_number_2",
       "pin": "your_pin_2"
     }
   ]
   ```

## 🚀 Usage

### Basic Usage

```bash
node index.js
```

The automation will process each account in your `accounts.json` file sequentially.

### Programmatic Usage

```javascript
const MeroShareAutomation = require('./index.js');

const credentials = {
  dpId: "your_dp_id",
  username: "your_username",
  password: "your_password",
  crnNumber: "your_crn_number",
  pin: "your_pin"
};

const automation = new MeroShareAutomation(credentials);
await automation.execute();
```

### Configuration

The automation has built-in configuration that can be accessed and modified through the `config` property:

```javascript
const automation = new MeroShareAutomation(credentials);

// Customize configuration
automation.config.timeout = 60000;        // API timeout in milliseconds
automation.config.retryAttempts = 3;      // Number of retry attempts
automation.config.defaultDelay = 1000;    // Default delay between actions
```

## 📁 Project Structure

```
meroshare-automation/
├── index.js                # Main automation class
├── accounts.json           # Account credentials configuration
├── package.json           # Project dependencies
├── README.md             # Project documentation
└── LICENSE              # License file
```

## 🔧 Configuration

### Account Credentials Format

Each account in `accounts.json` requires the following fields:

| Field | Description | Required |
|----------|-------------|----------|
| `dpId` | Your Depository Participant ID | ✅ |
| `username` | Your MeroShare username | ✅ |
| `password` | Your MeroShare password | ✅ |
| `crnNumber` | Your CRN number | ✅ |
| `pin` | Your 4-digit transaction PIN | ✅ |

### Application Settings

The automation applies for **10 units** by default. This value is currently hardcoded in the `fillApplicationForm` method.

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Contribution Guidelines

- **Code Style**: Follow the existing code style and conventions
- **Documentation**: Update documentation for any new features
- **Testing**: Add tests for new functionality when possible
- **Commit Messages**: Use clear and descriptive commit messages
- **Issue First**: For major changes, please open an issue first to discuss

### Areas for Contribution

- 🐛 **Bug Fixes**: Help identify and fix bugs
- ✨ **New Features**: Add new automation features
- 📚 **Documentation**: Improve documentation and examples
- 🧪 **Testing**: Add unit tests and integration tests
- 🎨 **UI/UX**: Improve user experience and error messages
- 🔧 **Configuration**: Add more configuration options
- 🚀 **Performance**: Optimize automation speed and reliability

## 🐛 Common Issues

### Issue: "Missing required environment variables"
**Solution**: Ensure all required environment variables are set in your `.env` file.

### Issue: "Failed to retrieve authorization token"
**Solution**: Check your login credentials and ensure MeroShare is accessible.

### Issue: "No applicable shares found"
**Solution**: Make sure there are active IPOs available for application.

### Issue: Browser automation fails
**Solution**: 
- Ensure Chrome is installed
- Try running with `headless: false` to see what's happening
- Check if MeroShare website structure has changed

## 📝 Roadmap

- [ ] Add support for multiple share applications in one run
- [ ] Implement email notifications for successful applications
- [ ] Add GUI interface for non-technical users
- [ ] Create Docker container for easy deployment
- [ ] Add comprehensive test suite
- [ ] Implement retry mechanisms for failed applications
- [ ] Add support for custom application amounts
- [ ] Create detailed logging and reporting features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **MeroShare Platform** for providing the service
- **Puppeteer Team** for the excellent automation library
- **Open Source Community** for inspiration and contributions

## 📞 Support

If you encounter any issues or have questions:

1. **Check the Issues**: Look through existing [GitHub Issues](https://github.com/yourusername/meroshare-automation/issues)
2. **Create New Issue**: If you can't find an answer, create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Your environment details (OS, Node.js version, etc.)
   - Relevant log outputs (remove sensitive information)

## ⭐ Show Your Support

If this project helped you, please consider:
- ⭐ **Starring the repository**
- 🐛 **Reporting bugs**
- 💡 **Suggesting new features**
- 🤝 **Contributing code**
- 📢 **Sharing with others**

---

**Made with ❤️ by the Open Source Community**

*Remember: Always verify your share applications manually. This tool is meant to assist, not replace, your due diligence.*