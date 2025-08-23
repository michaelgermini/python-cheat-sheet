# Deployment Guide

This guide explains how to deploy the Python Cheat Sheet Project to various platforms.

## 🚀 Quick Start

### Local Development
```bash
# Clone the repository
git clone https://github.com/yourusername/python-cheat-sheet.git
cd python-cheat-sheet

# Install dependencies
make install

# Build HTML pages
make build

# Start local server
make serve
```

### Docker Deployment
```bash
# Build and run with Docker
make docker-build
make docker-run

# Or use Docker Compose
docker-compose up -d
```

## 🌐 GitHub Pages Deployment

### Automatic Deployment (Recommended)
1. Push your code to the `main` branch
2. GitHub Actions will automatically build and deploy to GitHub Pages
3. Your site will be available at `https://yourusername.github.io/python-cheat-sheet`

### Manual Deployment
1. Go to your repository settings
2. Navigate to "Pages"
3. Set source to "GitHub Actions"
4. The workflow will handle the rest

## 🐳 Docker Deployment

### Production with Docker Compose
```bash
# Start production stack
docker-compose --profile production up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Custom Docker Build
```bash
# Build image
docker build -t python-cheat-sheet .

# Run container
docker run -d -p 8000:8000 --name cheat-sheet python-cheat-sheet

# Access at http://localhost:8000
```

## ☁️ Cloud Deployment

### Vercel
1. Connect your GitHub repository to Vercel
2. Set build command: `python src/scripts/create_pages.py`
3. Set output directory: `src/pages`
4. Deploy!

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `python src/scripts/create_pages.py`
3. Set publish directory: `src/pages`
4. Deploy!

### AWS S3 + CloudFront
1. Build the project: `make build`
2. Upload `src/pages/*` to S3 bucket
3. Configure CloudFront distribution
4. Set up custom domain (optional)

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PYTHONUNBUFFERED` | Enable unbuffered Python output | `1` |
| `PORT` | Server port | `8000` |

## 📊 Monitoring

### Health Checks
The application includes health checks:
- Docker: `curl -f http://localhost:8000/`
- Kubernetes: HTTP probe on port 8000

### Logs
```bash
# Docker logs
docker-compose logs -f python-cheat-sheet

# Application logs
tail -f logs/app.log
```

## 🔒 Security Considerations

- ✅ Static site generation (no server-side code execution)
- ✅ No sensitive data in the repository
- ✅ HTTPS enforced on production deployments
- ✅ Content Security Policy headers
- ✅ Regular dependency updates via Dependabot

## 🚨 Troubleshooting

### Common Issues

**Build fails:**
```bash
# Clean and rebuild
make clean
make build
```

**Docker won't start:**
```bash
# Check if port 8000 is available
lsof -i :8000

# Use different port
docker run -p 8080:8000 python-cheat-sheet
```

**GitHub Pages not updating:**
- Check GitHub Actions workflow status
- Verify `gh-pages` branch exists
- Check repository settings

## 📞 Support

If you encounter issues:
1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include your deployment environment and error logs
