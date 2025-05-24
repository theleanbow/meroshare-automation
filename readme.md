# MeroShare Automation 🚀

An automated tool for applying to Initial Public Offerings (IPOs) on the MeroShare platform in Nepal. This project aims to simplify the share application process through browser automation.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2014.0.0-brightgreen)](https://nodejs.org/)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/yourusername/meroshare-automation/issues)

## ⚠️ Disclaimer

This tool is for educational purposes only. Use at your own risk. The developers are not responsible for any financial losses or account issues that may arise from using this automation tool. Always verify your applications manually.

## ✨ Features

- **Automated Login**: Seamlessly logs into your MeroShare account
- **Smart Share Selection**: Automatically selects the first available IPO
- **Bank Integration**: Automatically selects your preferred bank account
- **Form Automation**: Fills all required application forms
- **Error Handling**: Comprehensive error handling and validation
- **Configurable**: Easy configuration through environment variables
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

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your credentials:
   ```env
   DP_ID=your_dp_id
   MERO_SHARE_USERNAME=your_username
   MERO_SHARE_PASSWORD=your_password
   MERO_SHARE_CRN_NUMBER=your_crn_number
   MERO_SHARE_PIN=your_4_digit_pin
   ```

## 🚀 Usage

### Basic Usage

```bash
node index.js
```

### Programmatic Usage

```javascript
const MeroShareAutomation = require('./src/meroshare-automation');

const automation = new MeroShareAutomation();
await automation.execute();
```

### Advanced Configuration

You can customize the automation behavior by modifying the configuration in the class constructor:

```javascript
const automation = new MeroShareAutomation();
automation.config.timeout = 60000; // Increase timeout to 60 seconds
automation.config.defaultDelay = 2000; // Increase delay between actions
await automation.execute();
```

## 📁 Project Structure

```
meroshare-automation/
├── index.js                       # Main automation class
├── example.env                    # Environment variables template
├── .gitignore                     # Git ignore file
├── package.json                   # Project dependencies
├── README.md                      # Project documentation
└── LICENSE                        # License file
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DP_ID` | Your Depository Participant ID | ✅ |
| `MERO_SHARE_USERNAME` | Your MeroShare username | ✅ |
| `MERO_SHARE_PASSWORD` | Your MeroShare password | ✅ |
| `MERO_SHARE_CRN_NUMBER` | Your CRN number | ✅ |
| `MERO_SHARE_PIN` | Your 4-digit transaction PIN | ✅ |

### Application Settings

The automation applies for **10 units** by default. To change this, modify the `appliedKitta` value in the `fillApplicationForm` method.

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