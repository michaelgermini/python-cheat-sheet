# Deployment & DevOps (Docker, CI/CD, Cloud Deployment)

## Docker for Python Applications

### Basic Dockerfile
```dockerfile
# Use official Python runtime as base image for consistent environment
FROM python:3.11-slim

# Set working directory in container for application files
WORKDIR /app

# Set environment variables for Python optimization and configuration
ENV PYTHONDONTWRITEBYTECODE=1 \    # Prevent Python from writing .pyc files
    PYTHONUNBUFFERED=1 \           # Force Python to run in unbuffered mode
    PYTHONPATH=/app                # Set Python path to include application directory

# Install system dependencies required for Python packages
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        gcc \                      # C compiler for building native extensions
        g++ \                      # C++ compiler for building native extensions
        libpq-dev \                # PostgreSQL development libraries
    && rm -rf /var/lib/apt/lists/* # Clean up package cache to reduce image size

# Copy requirements first for better Docker layer caching
COPY requirements.txt .

# Install Python dependencies with no cache to reduce image size
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code to container
COPY . .

# Create non-root user for security (follow principle of least privilege)
RUN adduser --disabled-password --gecos '' appuser \
    && chown -R appuser:appuser /app  # Change ownership of app directory
USER appuser  # Switch to non-root user

# Expose port for web application
EXPOSE 8000

# Health check to monitor application status
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1  # Check health endpoint

# Run application with Python interpreter
CMD ["python", "app.py"]
```

### Multi-stage Dockerfile
```dockerfile
# Multi-stage build for production: separate build and runtime environments
FROM python:3.11-slim as builder  # Build stage with all build dependencies

# Set working directory for build stage
WORKDIR /app

# Install build dependencies required for compiling Python packages
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        gcc \                      # C compiler for native extensions
        g++ \                      # C++ compiler for native extensions
        libpq-dev \                # PostgreSQL development libraries
    && rm -rf /var/lib/apt/lists/* # Clean up package cache

# Copy requirements file for dependency installation
COPY requirements.txt .

# Install dependencies in isolated virtual environment
RUN python -m venv /opt/venv       # Create virtual environment
ENV PATH="/opt/venv/bin:$PATH"     # Add virtual environment to PATH
RUN pip install --no-cache-dir -r requirements.txt  # Install Python packages

# Production stage: minimal runtime image
FROM python:3.11-slim as production  # Runtime stage without build tools

# Copy virtual environment from builder stage (contains all installed packages)
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"     # Set PATH to use virtual environment

# Set working directory for application
WORKDIR /app

# Create non-root user for security
RUN adduser --disabled-password --gecos '' appuser

# Copy application code with proper ownership
COPY --chown=appuser:appuser . .   # Copy files and set ownership

# Switch to non-root user for security
USER appuser

# Expose port for web application
EXPOSE 8000

# Run application using Python from virtual environment
CMD ["python", "app.py"]
```

### Docker Compose for Development
```yaml
# docker-compose.yml - Multi-service application orchestration
version: '3.8'  # Docker Compose file format version

services:
  web:  # Main Python web application service
    build: .                    # Build from local Dockerfile
    ports:
      - "8000:8000"            # Map host port 8000 to container port 8000
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/myapp  # Database connection string
      - REDIS_URL=redis://redis:6379/0                         # Redis connection string
      - DEBUG=True                                             # Enable debug mode for development
    volumes:
      - .:/app                 # Mount current directory for live code reloading
      - /app/__pycache__       # Exclude Python cache from volume mount
    depends_on:
      - db                     # Ensure database starts before web service
      - redis                  # Ensure Redis starts before web service
    command: python app.py     # Override default command for development
    restart: unless-stopped    # Restart policy for service recovery

  db:  # PostgreSQL database service
    image: postgres:15         # Use official PostgreSQL 15 image
    environment:
      - POSTGRES_DB=myapp      # Database name
      - POSTGRES_USER=user     # Database user
      - POSTGRES_PASSWORD=password  # Database password
    volumes:
      - postgres_data:/var/lib/postgresql/data  # Persist database data
    ports:
      - "5432:5432"            # Expose PostgreSQL port for external access
    restart: unless-stopped    # Restart policy for database service

  redis:  # Redis cache service
    image: redis:7-alpine      # Use lightweight Alpine-based Redis image
    ports:
      - "6379:6379"            # Expose Redis port for external access
    volumes:
      - redis_data:/data       # Persist Redis data
    restart: unless-stopped    # Restart policy for Redis service

  nginx:  # Reverse proxy and load balancer
    image: nginx:alpine        # Use lightweight Alpine-based Nginx image
    ports:
      - "80:80"                # HTTP port
      - "443:443"              # HTTPS port
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf  # Mount custom Nginx configuration
      - ./ssl:/etc/nginx/ssl                # Mount SSL certificates
    depends_on:
      - web                    # Ensure web service starts before Nginx
    restart: unless-stopped    # Restart policy for Nginx service

volumes:  # Named volumes for data persistence
  postgres_data:               # Volume for PostgreSQL data persistence
  redis_data:                  # Volume for Redis data persistence
```

### Docker Best Practices
```python
# requirements.txt - Production dependencies with version pinning
# Production dependencies: core application requirements
Flask==2.3.3          # Web framework for Python applications
gunicorn==21.2.0      # WSGI HTTP server for production deployment
psycopg2-binary==2.9.7  # PostgreSQL adapter for Python
redis==4.6.0          # Redis client for caching and message queuing
celery==5.3.1         # Distributed task queue for background jobs

# Development dependencies (optional): tools for development and testing
pytest==7.4.0         # Testing framework for Python
black==23.7.0         # Code formatter for consistent code style
flake8==6.0.0         # Linter for code quality and style checking

# .dockerignore - Files to exclude from Docker build context
__pycache__           # Python bytecode cache directories
*.pyc                 # Compiled Python files
*.pyo                 # Optimized Python files
*.pyd                 # Python extension modules
.Python               # Python executable
env                   # Virtual environment directories
pip-log.txt           # Pip installation logs
pip-delete-this-directory.txt  # Pip temporary files
.tox                  # Tox testing environment
.coverage             # Coverage reports
.coverage.*           # Coverage report variants
.cache                # Cache directories
nosetests.xml         # Nose test results
coverage.xml          # Coverage XML reports
*.cover               # Coverage files
*.log                 # Log files
.git                  # Git repository
.mypy_cache           # MyPy type checker cache
.pytest_cache         # Pytest cache
.hypothesis           # Hypothesis testing cache
.DS_Store             # macOS system files
.env                  # Environment variables
.venv                 # Virtual environment
venv/                 # Virtual environment
ENV/                  # Virtual environment
env/                  # Virtual environment
.idea/                # PyCharm IDE files
.vscode/              # VS Code IDE files
*.swp                 # Vim swap files
*.swo                 # Vim swap files
*~                    # Backup files

# Docker health check script
#!/bin/bash
# healthcheck.sh - Health check for Docker containers
curl -f http://localhost:8000/health || exit 1  # Check application health endpoint
```

## CI/CD with GitHub Actions

### Basic Python CI/CD Pipeline
```yaml
# .github/workflows/ci-cd.yml - Continuous Integration and Deployment pipeline
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]  # Trigger on pushes to main and develop branches
  pull_request:
    branches: [ main ]           # Trigger on pull requests to main branch

jobs:
  test:  # Testing job with matrix strategy for multiple Python versions
    runs-on: ubuntu-latest       # Use latest Ubuntu runner
    strategy:
      matrix:
        python-version: [3.9, 3.10, 3.11]  # Test against multiple Python versions

    steps:
    - uses: actions/checkout@v4   # Check out repository code
    
    - name: Set up Python ${{ matrix.python-version }}
      uses: actions/setup-python@v4  # Install specified Python version
      with:
        python-version: ${{ matrix.python-version }}  # Use matrix variable
    
    - name: Cache pip dependencies
      uses: actions/cache@v3      # Cache pip dependencies for faster builds
      with:
        path: ~/.cache/pip        # Cache pip cache directory
        key: ${{ runner.os }}-pip-${{ hashFiles('**/requirements.txt') }}  # Cache key based on requirements
        restore-keys: |
          ${{ runner.os }}-pip-   # Fallback cache key
    
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip  # Upgrade pip to latest version
        pip install -r requirements.txt      # Install production dependencies
        pip install -r requirements-dev.txt  # Install development dependencies
    
    - name: Run linting
      run: |
        flake8 .                  # Run code linting with flake8
        black --check .           # Check code formatting with black
        isort --check-only .      # Check import sorting with isort
    
    - name: Run type checking
      run: |
        mypy .                    # Run static type checking with mypy
    
    - name: Run tests
      run: |
        pytest --cov=app --cov-report=xml  # Run tests with coverage reporting
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3  # Upload coverage reports to Codecov
      with:
        file: ./coverage.xml       # Coverage report file
        flags: unittests           # Coverage flags for categorization
        name: codecov-umbrella     # Coverage report name

  security:  # Security scanning job
    runs-on: ubuntu-latest        # Use latest Ubuntu runner
    steps:
    - uses: actions/checkout@v4   # Check out repository code
    
    - name: Set up Python
      uses: actions/setup-python@v4  # Install Python 3.11
      with:
        python-version: 3.11      # Use Python 3.11 for security checks
    
    - name: Run security checks
      run: |
        pip install bandit safety  # Install security scanning tools
        bandit -r app/            # Run security linting on application code
        safety check              # Check for known security vulnerabilities

  build-and-push:  # Docker build and push job
    needs: [test, security]       # Wait for test and security jobs to complete
    runs-on: ubuntu-latest        # Use latest Ubuntu runner
    if: github.ref == 'refs/heads/main'  # Only run on main branch
    
    steps:
    - uses: actions/checkout@v4   # Check out repository code
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3  # Set up Docker Buildx for multi-platform builds
    
    - name: Login to Docker Hub
      uses: docker/login-action@v3  # Authenticate with Docker Hub
      with:
        username: ${{ secrets.DOCKER_USERNAME }}  # Docker Hub username from secrets
        password: ${{ secrets.DOCKER_PASSWORD }}  # Docker Hub password from secrets
    
    - name: Build and push Docker image
      uses: docker/build-push-action@v5  # Build and push Docker image
      with:
        context: .                # Build context (current directory)
        push: true                # Push image to registry
        tags: |
          myapp:latest           # Image tags for registry
```
          myapp:${{ github.sha }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Deploy to production
      run: |
        echo "Deploying to production..."
        # Add your deployment commands here
```

### Advanced CI/CD with Multiple Environments
```yaml
# .github/workflows/advanced-ci-cd.yml - Advanced CI/CD with multiple environments
name: Advanced CI/CD

on:
  push:
    branches: [ main, develop, staging ]  # Trigger on pushes to multiple branches
  pull_request:
    branches: [ main ]                    # Trigger on pull requests to main branch

env:
  REGISTRY: ghcr.io                      # GitHub Container Registry
  IMAGE_NAME: ${{ github.repository }}   # Image name based on repository

jobs:
  test:  # Comprehensive testing job with matrix strategy
    runs-on: ubuntu-latest               # Use latest Ubuntu runner
    strategy:
      matrix:
        python-version: [3.9, 3.10, 3.11]  # Test against multiple Python versions
        os: [ubuntu-latest, windows-latest] # Test against multiple operating systems

    steps:
    - uses: actions/checkout@v4           # Check out repository code
    
    - name: Set up Python ${{ matrix.python-version }}
      uses: actions/setup-python@v4      # Install specified Python version
      with:
        python-version: ${{ matrix.python-version }}  # Use matrix variable
    
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip  # Upgrade pip to latest version
        pip install -r requirements.txt      # Install production dependencies
        pip install -r requirements-dev.txt  # Install development dependencies
    
    - name: Run tests with coverage
      run: |
        pytest --cov=app --cov-report=xml --cov-report=html  # Run tests with multiple coverage formats
    
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3    # Upload coverage reports to Codecov
      with:
        file: ./coverage.xml             # XML coverage report
        directory: ./htmlcov             # HTML coverage report directory
        flags: unittests                 # Coverage flags for categorization
        name: codecov-umbrella           # Coverage report name

  integration-tests:  # Integration testing with database services
    runs-on: ubuntu-latest              # Use latest Ubuntu runner
    needs: test                         # Wait for test job to complete
    services:
      postgres:  # PostgreSQL service for integration tests
        image: postgres:15              # Use PostgreSQL 15
        env:
          POSTGRES_PASSWORD: postgres   # Database password
          POSTGRES_DB: test_db          # Test database name
        options: >-                     # Health check configuration
          --health-cmd pg_isready       # Health check command
          --health-interval 10s         # Health check interval
          --health-timeout 5s           # Health check timeout
          --health-retries 5            # Health check retries
        ports:
          - 5432:5432                   # Expose PostgreSQL port
```
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: 3.11
    
    - name: Install dependencies
      run: |
        pip install -r requirements.txt
        pip install -r requirements-test.txt
    
    - name: Run integration tests
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
        REDIS_URL: redis://localhost:6379/0
      run: |
        pytest tests/integration/ -v

  build:
    runs-on: ubuntu-latest
    needs: [test, integration-tests]
    outputs:
      image-tag: ${{ steps.meta.outputs.tags }}
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3
    
    - name: Docker meta
      id: meta
      uses: docker/metadata-action@v5
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=semver,pattern={{version}}
          type=semver,pattern={{major}}.{{minor}}
          type=sha
    
    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: .
        platforms: linux/amd64,linux/arm64
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/develop'
    environment: staging
    
    steps:
    - name: Deploy to staging
      run: |
        echo "Deploying to staging environment..."
        # Add staging deployment commands

  deploy-production:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
    - name: Deploy to production
      run: |
        echo "Deploying to production environment..."
        # Add production deployment commands
```

## Cloud Deployment

### AWS Lambda Deployment
```yaml
# serverless.yml for AWS Lambda
service: my-python-app

provider:
  name: aws
  runtime: python3.11
  region: us-east-1
  environment:
    STAGE: ${opt:stage, 'dev'}
    DATABASE_URL: ${ssm:/myapp/${opt:stage, 'dev'}/database-url}
    REDIS_URL: ${ssm:/myapp/${opt:stage, 'dev'}/redis-url}

functions:
  api:
    handler: handler.api
    events:
      - http:
          path: /{proxy+}
          method: ANY
          cors: true
    environment:
      POWERTOOLS_SERVICE_NAME: myapp
      LOG_LEVEL: INFO
    memorySize: 512
    timeout: 30

  scheduled-task:
    handler: handler.scheduled_task
    events:
      - schedule: rate(1 hour)
    environment:
      POWERTOOLS_SERVICE_NAME: myapp-scheduler
    memorySize: 256
    timeout: 60

plugins:
  - serverless-python-requirements
  - serverless-offline

custom:
  pythonRequirements:
    dockerizePip: true
    layer:
      name: python-deps
      description: Python dependencies for myapp
    noDeploy:
      - coverage
      - pytest
      - black
      - flake8
```

### Google Cloud Run Deployment
```yaml
# cloudbuild.yaml for Google Cloud Run
steps:
  # Build the container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/myapp:$COMMIT_SHA', '.']
  
  # Push the container image to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/myapp:$COMMIT_SHA']
  
  # Deploy container image to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'myapp'
      - '--image'
      - 'gcr.io/$PROJECT_ID/myapp:$COMMIT_SHA'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
      - '--set-env-vars'
      - 'DATABASE_URL=${_DATABASE_URL}'
      - '--memory'
      - '512Mi'
      - '--cpu'
      - '1'
      - '--max-instances'
      - '10'

images:
  - 'gcr.io/$PROJECT_ID/myapp:$COMMIT_SHA'

substitutions:
  _DATABASE_URL: 'postgresql://user:pass@host:5432/db'
```

### Heroku Deployment
```toml
# Procfile for Heroku
web: gunicorn app:app --bind 0.0.0.0:$PORT --workers 4 --worker-class gevent
worker: celery -A app.celery worker --loglevel=info
beat: celery -A app.celery beat --loglevel=info

# runtime.txt
python-3.11.5

# app.json for Heroku
{
  "name": "My Python App",
  "description": "A Python web application",
  "repository": "https://github.com/username/myapp",
  "logo": "https://node-js-sample.herokuapp.com/node.png",
  "keywords": ["python", "flask", "web"],
  "env": {
    "DATABASE_URL": {
      "description": "PostgreSQL database URL",
      "generator": "secret"
    },
    "SECRET_KEY": {
      "description": "Secret key for the application",
      "generator": "secret"
    }
  },
  "addons": [
    "heroku-postgresql:mini",
    "heroku-redis:mini"
  ],
  "buildpacks": [
    {
      "url": "heroku/python"
    }
  ]
}
```

## Production Best Practices

### Application Configuration
```python
# config.py
import os
from dataclasses import dataclass
from typing import Optional

@dataclass
class Config:
    """Application configuration."""
    
    # Database
    DATABASE_URL: str = os.getenv('DATABASE_URL', 'sqlite:///app.db')
    
    # Redis
    REDIS_URL: str = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
    
    # Security
    SECRET_KEY: str = os.getenv('SECRET_KEY', 'dev-secret-key')
    DEBUG: bool = os.getenv('DEBUG', 'False').lower() == 'true'
    
    # Logging
    LOG_LEVEL: str = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FORMAT: str = os.getenv('LOG_FORMAT', 'json')
    
    # Application
    HOST: str = os.getenv('HOST', '0.0.0.0')
    PORT: int = int(os.getenv('PORT', '8000'))
    WORKERS: int = int(os.getenv('WORKERS', '4'))
    
    # External services
    API_KEY: Optional[str] = os.getenv('API_KEY')
    WEBHOOK_URL: Optional[str] = os.getenv('WEBHOOK_URL')

# Environment-specific configurations
class DevelopmentConfig(Config):
    DEBUG = True
    LOG_LEVEL = 'DEBUG'

class ProductionConfig(Config):
    DEBUG = False
    LOG_LEVEL = 'WARNING'

class TestingConfig(Config):
    DATABASE_URL = 'sqlite:///:memory:'
    TESTING = True

# Configuration factory
def get_config(env: str = None) -> Config:
    """Get configuration based on environment."""
    if env is None:
        env = os.getenv('FLASK_ENV', 'development')
    
    configs = {
        'development': DevelopmentConfig,
        'production': ProductionConfig,
        'testing': TestingConfig
    }
    
    return configs.get(env, DevelopmentConfig)()
```

### Production WSGI Application
```python
# app.py
import logging
from flask import Flask
from gunicorn.app.base import BaseApplication
from gunicorn.six import iteritems

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_app(config=None):
    """Application factory."""
    app = Flask(__name__)
    
    if config:
        app.config.from_object(config)
    
    # Register blueprints
    from .routes import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')
    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        return {'status': 'healthy'}, 200
    
    return app

# Gunicorn application class
class StandaloneApplication(BaseApplication):
    def __init__(self, app, options=None):
        self.options = options or {}
        self.application = app
        super(StandaloneApplication, self).__init__()

    def load_config(self):
        config = dict([(key, value) for key, value in iteritems(self.options)
                      if key in self.cfg.settings and value is not None])
        for key, value in iteritems(config):
            self.cfg.set(key.lower(), value)

    def load(self):
        return self.application

if __name__ == '__main__':
    from config import get_config
    
    config = get_config()
    app = create_app(config)
    
    options = {
        'bind': f'{config.HOST}:{config.PORT}',
        'workers': config.WORKERS,
        'worker_class': 'gevent',
        'worker_connections': 1000,
        'max_requests': 1000,
        'max_requests_jitter': 100,
        'timeout': 30,
        'keepalive': 2,
        'preload_app': True,
        'access_log_format': '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s',
    }
    
    StandaloneApplication(app, options).run()
```

### Monitoring and Observability
```python
# monitoring.py
import logging
import time
from functools import wraps
from prometheus_client import Counter, Histogram, Gauge
from opentelemetry import trace
from opentelemetry.exporter.jaeger.thrift import JaegerExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

# Prometheus metrics
REQUEST_COUNT = Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint', 'status'])
REQUEST_DURATION = Histogram('http_request_duration_seconds', 'HTTP request duration')
ACTIVE_REQUESTS = Gauge('http_requests_active', 'Active HTTP requests')

# OpenTelemetry setup
def setup_tracing():
    """Setup OpenTelemetry tracing."""
    trace.set_tracer_provider(TracerProvider())
    jaeger_exporter = JaegerExporter(
        agent_host_name="localhost",
        agent_port=6831,
    )
    span_processor = BatchSpanProcessor(jaeger_exporter)
    trace.get_tracer_provider().add_span_processor(span_processor)

# Decorators for monitoring
def monitor_request(func):
    """Decorator to monitor HTTP requests."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        ACTIVE_REQUESTS.inc()
        
        try:
            result = func(*args, **kwargs)
            REQUEST_COUNT.labels(
                method='GET',  # Adjust based on your framework
                endpoint=func.__name__,
                status=200
            ).inc()
            return result
        except Exception as e:
            REQUEST_COUNT.labels(
                method='GET',
                endpoint=func.__name__,
                status=500
            ).inc()
            raise
        finally:
            duration = time.time() - start_time
            REQUEST_DURATION.observe(duration)
            ACTIVE_REQUESTS.dec()
    
    return wrapper

# Structured logging
class StructuredLogger:
    """Structured logging for production."""
    
    def __init__(self, name: str):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(logging.INFO)
        
        # JSON formatter for production
        if os.getenv('LOG_FORMAT') == 'json':
            import json_logging
            handler = logging.StreamHandler()
            handler.setFormatter(json_logging.JSONRequestLogFormatter())
            self.logger.addHandler(handler)
    
    def info(self, message: str, **kwargs):
        self.logger.info(message, extra=kwargs)
    
    def error(self, message: str, **kwargs):
        self.logger.error(message, extra=kwargs)
    
    def warning(self, message: str, **kwargs):
        self.logger.warning(message, extra=kwargs)

# Usage
logger = StructuredLogger(__name__)
```

---

[Previous Chapter](14-datascience.md) | [Next Chapter](16-security.md)
