# Contributing to Python Cheat Sheet Project

Thank you for your interest in contributing to the Python Cheat Sheet Project! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Types of Contributions

We welcome various types of contributions:

- **🐛 Bug Reports**: Report issues you find
- **💡 Feature Requests**: Suggest new features or improvements
- **📝 Documentation**: Improve or add documentation
- **🎨 UI/UX Improvements**: Enhance the website design
- **🔧 Code Improvements**: Optimize existing code
- **📚 Content**: Add new Python topics or improve existing content

### Getting Started

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/yourusername/python-cheat-sheet.git
   cd python-cheat-sheet
   ```

3. **Set up development environment**:
   ```bash
   make install
   make build
   make serve
   ```

4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Development Guidelines

### Code Style

- **Python**: Follow PEP 8 guidelines
- **HTML/CSS**: Use consistent indentation (2 spaces)
- **JavaScript**: Use ES6+ features when possible
- **Comments**: Write clear, English comments

### File Structure

```
python-cheat-sheet/
├── content/           # Markdown content files
├── src/
│   ├── pages/        # Generated HTML pages
│   ├── assets/       # CSS, JS, images
│   ├── templates/    # HTML templates
│   └── scripts/      # Build scripts
├── docs/             # Documentation
└── .github/          # GitHub configuration
```

### Adding New Content

1. **Create a new Markdown file** in `content/`:
   ```markdown
   # Your Topic Title
   
   Brief description of the topic.
   
   ## Key Concepts
   
   - Concept 1
   - Concept 2
   
   ## Examples
   
   ```python
   # Your code example
   print("Hello, World!")
   ```
   ```

2. **Update navigation** in `src/templates/template.html`

3. **Test locally**:
   ```bash
   make build
   make serve
   ```

### Testing Your Changes

```bash
# Build the project
make build

# Start local server
make serve

# Test in browser
open http://localhost:8000
```

## 🚀 Pull Request Process

### Before Submitting

1. **Test your changes** thoroughly
2. **Update documentation** if needed
3. **Follow the commit message format**:
   ```
   type(scope): description
   
   Examples:
   feat(content): add new Python topic
   fix(ui): resolve search box styling issue
   docs(readme): update installation instructions
   ```

### Pull Request Checklist

- [ ] Code follows project style guidelines
- [ ] Tests pass (if applicable)
- [ ] Documentation is updated
- [ ] Changes are tested locally
- [ ] Commit messages are clear and descriptive
- [ ] PR description explains the changes

### Review Process

1. **Submit your PR** with a clear description
2. **Wait for review** from maintainers
3. **Address feedback** if any changes are requested
4. **PR will be merged** once approved

## 🐛 Reporting Issues

### Bug Report Template

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md) and include:

- **Clear description** of the issue
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Environment details** (OS, browser, etc.)
- **Screenshots** if applicable

### Feature Request Template

Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md) and include:

- **Problem description**
- **Proposed solution**
- **Alternative solutions** considered
- **Additional context**

## 📚 Documentation

### Writing Documentation

- Use clear, concise language
- Include code examples
- Add screenshots for UI changes
- Keep documentation up to date

### Documentation Structure

```
docs/
├── DEPLOYMENT.md      # Deployment guide
├── CONTRIBUTING.md    # This file
├── README.md          # Main project documentation
└── API.md            # API documentation (if applicable)
```

## 🎨 Design Guidelines

### UI/UX Principles

- **Consistency**: Follow existing design patterns
- **Accessibility**: Ensure WCAG 2.1 AA compliance
- **Responsive**: Design for all screen sizes
- **Performance**: Optimize for fast loading

### Color Scheme

- **Primary**: `#3776ab` (Python blue)
- **Secondary**: `#ffd43b` (Python yellow)
- **Background**: `#1a1a1a` (Dark theme)
- **Text**: `#e0e0e0` (Light text)

## 🔧 Development Tools

### Recommended Tools

- **Editor**: VS Code, PyCharm, or your preferred editor
- **Browser**: Chrome, Firefox, Safari for testing
- **Git**: Latest version
- **Python**: 3.11+

### Useful Commands

```bash
# Development workflow
make install    # Install dependencies
make build      # Build HTML pages
make serve      # Start local server
make clean      # Clean build artifacts

# Git workflow
git status      # Check status
git add .       # Stage changes
git commit -m "type(scope): description"
git push origin feature/your-feature-name
```

## 🏷️ Labels and Milestones

### Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `needs-triage`: Needs review and categorization

### Milestones

- `v1.0.0`: Initial release
- `v1.1.0`: Minor features and improvements
- `v1.2.0`: Major features and enhancements

## 📞 Getting Help

### Communication Channels

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Pull Requests**: For code contributions

### Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read our [Code of Conduct](CODE_OF_CONDUCT.md) for details.

## 🙏 Recognition

Contributors will be recognized in:

- **README.md**: List of contributors
- **Release notes**: Credit for significant contributions
- **GitHub contributors page**: Automatic recognition

---

Thank you for contributing to the Python Cheat Sheet Project! 🐍✨
