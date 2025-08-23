# Python Best Practices (PEP8, Documentation, Packaging)

## Code Style and PEP8

### PEP8 Guidelines
```python
# Good: Follow PEP8 naming conventions for clean, readable code
class UserAccount:  # Class names use PascalCase (CapitalizedWords)
    """User account management class with proper documentation."""
    
    def __init__(self, username: str, email: str):  # Parameters use snake_case
        self.username = username  # Instance attributes use snake_case
        self.email = email        # Email address for user account
        self._is_active = True    # Private attributes use leading underscore
    
    def get_user_info(self) -> dict:  # Method names use snake_case
        """Get user information as dictionary with proper return type hint."""
        return {
            'username': self.username,  # Return username
            'email': self.email,        # Return email address
            'is_active': self._is_active  # Return account status
        }

# Constants use UPPER_CASE with underscores for readability
MAX_RETRY_ATTEMPTS = 3    # Maximum number of retry attempts
DEFAULT_TIMEOUT = 30      # Default timeout in seconds

# Functions and variables use snake_case for consistency
def calculate_user_score(user_data: dict) -> float:  # Function with type hints
    """Calculate user score based on activity data."""
    base_score = user_data.get('base_score', 0)      # Use .get() for safe access
    bonus_points = user_data.get('bonus_points', 0)  # Provide default values
    return base_score + bonus_points  # Return calculated total score

# Bad: Examples of what NOT to do (anti-patterns)
class userAccount:  # Should be UserAccount (PascalCase)
    def __init__(self, UserName, EMAIL):  # Should be snake_case parameters
        self.UserName = UserName  # Should be snake_case attributes
        self.EMAIL = EMAIL        # Should be snake_case
```

### Import Organization
```python
# Import organization: follow the standard order for clean, maintainable code

# 1. Standard library imports first (Python built-in modules)
import os                    # Operating system interface
import sys                   # System-specific parameters
from datetime import datetime  # Date and time handling
from typing import List, Dict, Optional  # Type hints

# 2. Third-party imports (external packages)
import numpy as np           # Numerical computing library
import pandas as pd          # Data manipulation library
from flask import Flask, request  # Web framework components

# 3. Local application imports (your own modules)
from .models import User     # Relative import for local models
from .utils import helper_function  # Relative import for local utilities

# Import best practices and guidelines
# Avoid wildcard imports for better code clarity
# Bad: from module import *  # Imports everything, can cause namespace pollution
# Good: from module import specific_function  # Explicit imports are clearer

# Use absolute imports when possible for better maintainability
# Good: from mypackage.submodule import function  # Clear dependency path
# Avoid: from .submodule import function  # Use only when relative import is necessary
```

### Line Length and Formatting
```python
# Line length and formatting: keep code readable and maintainable

# Keep lines under 79 characters (88 with black formatter)
# Use parentheses for automatic line continuation (preferred method)
long_string = (
    "This is a very long string that needs to be "  # First part of string
    "broken across multiple lines for readability"   # Second part of string
)

# Function calls with many parameters: break for clarity
result = complex_function(
    parameter1,    # First parameter
    parameter2,    # Second parameter
    parameter3,    # Third parameter
    parameter4     # Fourth parameter
)

# Long dictionary/list definitions: structure for readability
config = {
    'database': {           # Database configuration section
        'host': 'localhost', # Database host
        'port': 5432,        # Database port
        'name': 'myapp'      # Database name
    },
    'cache': {              # Cache configuration section
        'enabled': True,     # Enable caching
        'ttl': 3600         # Time to live in seconds
    }
}

# Use backslashes only when parentheses don't work
from some.very.long.module.path import \
    very_long_function_name  # Import specific function from long path
```

## Documentation Standards

### Docstring Formats

#### Google Style Docstrings
```python
def process_user_data(user_id: int, include_history: bool = True) -> dict:
    """Process user data and return formatted information with comprehensive documentation.
    
    This function retrieves user data from the database, processes it according to
    specified parameters, and returns a structured dictionary with user information.
    
    Args:
        user_id: The unique identifier for the user (must be positive integer).
        include_history: Whether to include user activity history in the response.
            Defaults to True for backward compatibility.
    
    Returns:
        A dictionary containing processed user data with the following structure:
            - user_info: Basic user information (name, id, email, etc.)
            - history: User activity history (if include_history is True)
            - metadata: Processing metadata (timestamp, version, etc.)
    
    Raises:
        ValueError: If user_id is not a positive integer or invalid format.
        UserNotFoundError: If user with the given ID doesn't exist in database.
        DatabaseError: If there's an issue connecting to or querying the database.
    
    Example:
        >>> result = process_user_data(123, include_history=False)
        >>> print(result['user_info']['name'])
        'John Doe'
        >>> print('history' in result)
        False
    """
    if not isinstance(user_id, int) or user_id <= 0:  # Validate input parameter
        raise ValueError("user_id must be a positive integer")  # Raise error for invalid input
    
    # Implementation here (database query, data processing, etc.)
    return {
        'user_info': {'name': 'John Doe', 'id': user_id},  # Basic user data
        'history': [] if not include_history else ['activity1', 'activity2'],  # Conditional history
        'metadata': {'processed_at': datetime.now()}  # Processing timestamp
    }
```

#### NumPy Style Docstrings
```python
def calculate_statistics(data: List[float]) -> Dict[str, float]:
    """
    Calculate comprehensive statistical measures for a list of numerical data.
    
    This function computes various statistical measures including central tendency,
    dispersion, and range statistics for the provided numerical dataset.
    
    Parameters
    ----------
    data : list of float
        Input data for statistical analysis. Must contain numeric values only.
        Empty lists will raise a ValueError.
    
    Returns
    -------
    dict
        Dictionary containing calculated statistics with the following keys:
        - mean: arithmetic mean (average) of the data values
        - median: middle value when data is sorted (50th percentile)
        - std: standard deviation measuring data dispersion
        - min: minimum value in the dataset
        - max: maximum value in the dataset
    
    Raises
    ------
    ValueError
        If data is empty, contains non-numeric values, or is None.
    TypeError
        If data is not a list or contains non-numeric elements.
    
    Examples
    --------
    >>> data = [1.0, 2.0, 3.0, 4.0, 5.0]
    >>> stats = calculate_statistics(data)
    >>> print(f"Mean: {stats['mean']:.2f}")
    Mean: 3.00
    >>> print(f"Standard deviation: {stats['std']:.2f}")
    Standard deviation: 1.58
    """
    if not data:  # Check for empty data
        raise ValueError("Data cannot be empty")  # Raise error for empty dataset
    
    # Implementation with proper error handling and calculations
    return {
        'mean': sum(data) / len(data),                    # Calculate arithmetic mean
        'median': sorted(data)[len(data) // 2],           # Calculate median
        'std': 1.0,  # Simplified standard deviation      # Calculate standard deviation
        'min': min(data),                                 # Find minimum value
        'max': max(data)                                  # Find maximum value
    }
```

### Type Hints
```python
from typing import List, Dict, Optional, Union, Tuple, Callable  # Import type hint classes
from dataclasses import dataclass  # Import dataclass decorator

# Type hints: provide static type information for better code documentation and IDE support
def greet(name: str, age: int) -> str:  # Function with type hints for parameters and return
    return f"Hello {name}, you are {age} years old"  # Return type is str

# Complex type hints
def process_data(
    items: List[Dict[str, Union[str, int, float]]],
    callback: Optional[Callable[[str], bool]] = None
) -> Tuple[List[str], int]:
    """Process a list of dictionaries with optional callback."""
    processed = []
    count = 0
    
    for item in items:
        if callback and callback(str(item)):
            processed.append(str(item))
            count += 1
    
    return processed, count

# Using dataclasses with type hints
@dataclass
class UserProfile:
    """User profile data structure."""
    user_id: int
    username: str
    email: str
    is_active: bool = True
    preferences: Optional[Dict[str, str]] = None

# Generic types
from typing import TypeVar, Generic

T = TypeVar('T')

class Stack(Generic[T]):
    """Generic stack implementation."""
    
    def __init__(self) -> None:
        self._items: List[T] = []
    
    def push(self, item: T) -> None:
        self._items.append(item)
    
    def pop(self) -> T:
        return self._items.pop()
    
    def is_empty(self) -> bool:
        return len(self._items) == 0
```

## Pythonic Idioms

### List Comprehensions and Generator Expressions
```python
# List comprehensions: concise and readable way to create lists from iterables
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]  # Sample data for demonstrations

# Filter and transform: combine filtering and mapping in one expression
even_squares = [x**2 for x in numbers if x % 2 == 0]  # Square only even numbers

# Nested comprehensions: create 2D structures efficiently
matrix = [[i + j for j in range(3)] for i in range(3)]  # Create 3x3 matrix

# Dictionary comprehensions: create dictionaries from iterables
word_counts = {word: text.count(word) for word in set(text.split())}  # Count word frequencies

# Set comprehensions: create sets with unique values
unique_squares = {x**2 for x in numbers}  # Set of unique squares

# Generator expressions: memory-efficient alternative to list comprehensions
# Use () instead of [] for large datasets to avoid loading everything into memory
large_sum = sum(x**2 for x in range(1000000))  # Calculate sum without storing all squares

# Generator function: yield values one at a time for memory efficiency
def fibonacci_generator(n: int):
    """Generate Fibonacci numbers up to n using generator pattern."""
    a, b = 0, 1  # Initialize first two Fibonacci numbers
    while a < n:  # Continue while current number is less than limit
        yield a   # Yield current number (pause execution here)
        a, b = b, a + b  # Calculate next Fibonacci number

# Usage: convert generator to list when needed
fib_numbers = list(fibonacci_generator(100))  # Get first 100 Fibonacci numbers
```

### Unpacking and Extended Unpacking
```python
# Unpacking: elegant way to assign multiple variables from iterables
x, y, z = [1, 2, 3]  # Basic unpacking: assign list elements to variables

# Extended unpacking (Python 3.0+): capture multiple values with * operator
first, *middle, last = [1, 2, 3, 4, 5]  # Capture first, middle elements, and last
# Result: first = 1, middle = [2, 3, 4], last = 5

# Dictionary unpacking: merge dictionaries with ** operator
defaults = {'timeout': 30, 'retries': 3}  # Default configuration
config = {**defaults, 'timeout': 60}      # Override timeout while keeping other defaults

# Function argument unpacking: pass iterables as individual arguments
def process_items(*args, **kwargs):  # Accept variable number of arguments
    print(f"Positional args: {args}")     # Print positional arguments
    print(f"Keyword args: {kwargs}")      # Print keyword arguments

# Call with unpacking: spread iterables into function arguments
items = [1, 2, 3]                    # List of items to process
options = {'verbose': True}           # Dictionary of options
process_items(*items, **options)      # Unpack list and dict into function call
```

### Walrus Operator (Python 3.8+)
```python
# Walrus operator (:=): assign values as part of expressions (Python 3.8+)

# Assignment expressions: assign and use value in same expression
if (n := len([1, 2, 3, 4, 5])) > 3:  # Assign length to n and check if > 3
    print(f"List has {n} items")      # Use assigned value n

# In while loops: assign input and check condition simultaneously
while (line := input()) != "quit":    # Get input and assign to line, check if not "quit"
    print(f"You entered: {line}")     # Use assigned value line

# In list comprehensions: avoid computing values twice
data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]  # Sample data
filtered = [x for x in data if (sqrt := x**0.5) > 2]  # Compute sqrt once, use in condition

# In conditional expressions: assign expensive calculation result
result = (value := expensive_calculation()) if condition else default_value  # Avoid computing twice
```

### Context Managers
```python
# Context managers: ensure proper resource management with automatic cleanup

# Custom context manager class: implement __enter__ and __exit__ methods
class DatabaseConnection:
    def __init__(self, host: str, port: int):
        self.host = host      # Database host address
        self.port = port      # Database port number
        self.connection = None # Connection object (initially None)
    
    def __enter__(self):  # Called when entering 'with' block
        print(f"Connecting to {self.host}:{self.port}")
        self.connection = "connected"  # Simulate database connection
        return self.connection  # Return connection for use in 'with' block
    
    def __exit__(self, exc_type, exc_val, exc_tb):  # Called when exiting 'with' block
        print("Closing connection")
        self.connection = None  # Clean up connection
        if exc_type:  # Check if an exception occurred
            print(f"Error occurred: {exc_val}")
        return False  # Re-raise exception (True would suppress it)

# Usage: automatic resource management
with DatabaseConnection("localhost", 5432) as conn:  # Connection automatically opened
    print(f"Using connection: {conn}")               # Use connection safely
# Connection automatically closed when exiting 'with' block

# Using contextlib for simpler context managers: decorator approach
from contextlib import contextmanager

@contextmanager
def timer(operation_name: str):  # Context manager for timing operations
    """Context manager for timing operations with automatic cleanup."""
    start_time = time.time()     # Record start time
    try:
        yield                    # Pause here and return control to 'with' block
    finally:
        end_time = time.time()   # Record end time (always executed)
        print(f"{operation_name} took {end_time - start_time:.4f} seconds")

# Usage: automatic timing with cleanup
with timer("data processing"):  # Start timing
    time.sleep(1)               # Simulate work
# Timing automatically stopped and printed when exiting 'with' block
```

## Package Management

### Virtual Environments
```python
# Creating virtual environment
# python -m venv myenv

# Activating virtual environment
# Windows: myenv\Scripts\activate
# Unix/MacOS: source myenv/bin/activate

# Deactivating
# deactivate

# Requirements file
# requirements.txt
"""
flask==2.3.3
pandas>=1.5.0
numpy==1.24.3
pytest>=7.0.0
"""

# Installing from requirements
# pip install -r requirements.txt

# Generating requirements
# pip freeze > requirements.txt
```

### Project Structure
```python
# Recommended project structure
"""
myproject/
├── myproject/
│   ├── __init__.py
│   ├── core.py
│   ├── utils.py
│   └── models.py
├── tests/
│   ├── __init__.py
│   ├── test_core.py
│   └── test_utils.py
├── docs/
│   ├── api.md
│   └── user_guide.md
├── requirements.txt
├── setup.py
├── pyproject.toml
├── README.md
└── .gitignore
"""
```

### Setup.py Configuration
```python
from setuptools import setup, find_packages

setup(
    name="myproject",
    version="1.0.0",
    author="Your Name",
    author_email="your.email@example.com",
    description="A short description of your project",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    url="https://github.com/username/myproject",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
    ],
    python_requires=">=3.8",
    install_requires=[
        "requests>=2.25.0",
        "pandas>=1.3.0",
    ],
    extras_require={
        "dev": [
            "pytest>=6.0",
            "black>=21.0",
            "flake8>=3.8",
        ],
    },
    entry_points={
        "console_scripts": [
            "myproject=myproject.cli:main",
        ],
    },
)
```

### Pyproject.toml (Modern Python Packaging)
```toml
[build-system]
requires = ["setuptools>=45", "wheel", "setuptools_scm[toml]>=6.2"]
build-backend = "setuptools.build_meta"

[project]
name = "myproject"
dynamic = ["version"]
description = "A modern Python project"
readme = "README.md"
requires-python = ">=3.8"
license = {text = "MIT"}
authors = [
    {name = "Your Name", email = "your.email@example.com"},
]
keywords = ["python", "package", "example"]
classifiers = [
    "Development Status :: 3 - Alpha",
    "Intended Audience :: Developers",
    "License :: OSI Approved :: MIT License",
    "Programming Language :: Python :: 3",
    "Programming Language :: Python :: 3.8",
    "Programming Language :: Python :: 3.9",
    "Programming Language :: Python :: 3.10",
]
dependencies = [
    "requests>=2.25.0",
    "pandas>=1.3.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=6.0",
    "black>=21.0",
    "flake8>=3.8",
    "mypy>=0.900",
]

[project.scripts]
myproject = "myproject.cli:main"

[project.urls]
Homepage = "https://github.com/username/myproject"
Documentation = "https://myproject.readthedocs.io/"
Repository = "https://github.com/username/myproject"
"Bug Tracker" = "https://github.com/username/myproject/issues"

[tool.setuptools_scm]
write_to = "myproject/_version.py"

[tool.black]
line-length = 88
target-version = ['py38']
include = '\.pyi?$'

[tool.isort]
profile = "black"
multi_line_output = 3

[tool.mypy]
python_version = "3.8"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true

[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py"]
python_classes = ["Test*"]
python_functions = ["test_*"]
addopts = "-v --tb=short"
```

## Code Quality Tools

### Linting and Formatting
```python
# .flake8 configuration
"""
[flake8]
max-line-length = 88
extend-ignore = E203, W503
exclude = .git,__pycache__,build,dist
per-file-ignores =
    __init__.py:F401
    tests/*:S101
"""

# .pylintrc configuration
"""
[MASTER]
disable=
    C0114, # missing-module-docstring
    C0115, # missing-class-docstring
    C0116, # missing-function-docstring

[FORMAT]
max-line-length=88

[MESSAGES CONTROL]
disable=C0111,R0903,C0103

[REPORTS]
output-format=text
score=yes
"""

# Pre-commit hooks
# .pre-commit-config.yaml
"""
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files

  - repo: https://github.com/psf/black
    rev: 23.3.0
    hooks:
      - id: black

  - repo: https://github.com/pycqa/isort
    rev: 5.12.0
    hooks:
      - id: isort

  - repo: https://github.com/pycqa/flake8
    rev: 6.0.0
    hooks:
      - id: flake8
"""
```

### Testing Best Practices
```python
# Test structure example
import pytest
from unittest.mock import Mock, patch
from myproject.core import process_data

class TestDataProcessing:
    """Test suite for data processing functionality."""
    
    def setup_method(self):
        """Set up test fixtures."""
        self.sample_data = [1, 2, 3, 4, 5]
    
    def test_process_data_with_valid_input(self):
        """Test data processing with valid input."""
        result = process_data(self.sample_data)
        assert result is not None
        assert len(result) == len(self.sample_data)
    
    def test_process_data_with_empty_input(self):
        """Test data processing with empty input."""
        with pytest.raises(ValueError, match="Data cannot be empty"):
            process_data([])
    
    @patch('myproject.core.external_api_call')
    def test_process_data_with_mock(self, mock_api):
        """Test data processing with mocked external API."""
        mock_api.return_value = {'status': 'success'}
        result = process_data(self.sample_data)
        mock_api.assert_called_once()
        assert result['api_status'] == 'success'
    
    @pytest.mark.parametrize("input_data,expected", [
        ([1, 2, 3], 6),
        ([0, 0, 0], 0),
        ([-1, -2, -3], -6),
    ])
    def test_sum_calculation(self, input_data, expected):
        """Test sum calculation with various inputs."""
        result = sum(input_data)
        assert result == expected
```

## Performance Best Practices

### Efficient Data Structures
```python
from collections import defaultdict, Counter, deque
from typing import List, Dict

# Use Counter for frequency counting
def count_words(text: str) -> Dict[str, int]:
    """Count word frequencies in text."""
    return Counter(text.lower().split())

# Use defaultdict to avoid KeyError
def group_by_category(items: List[Dict]) -> Dict[str, List]:
    """Group items by category."""
    grouped = defaultdict(list)
    for item in items:
        grouped[item['category']].append(item)
    return dict(grouped)

# Use deque for efficient queue operations
def process_queue(items: List[str]) -> List[str]:
    """Process items in FIFO order."""
    queue = deque(items)
    processed = []
    
    while queue:
        item = queue.popleft()  # O(1) operation
        processed.append(item.upper())
    
    return processed

# Use sets for membership testing
def find_common_elements(list1: List, list2: List) -> set:
    """Find common elements between two lists."""
    set1 = set(list1)
    set2 = set(list2)
    return set1 & set2  # Set intersection
```

### Memory Optimization
```python
# Use generators for large datasets
def read_large_file(filename: str):
    """Read large file line by line."""
    with open(filename, 'r') as f:
        for line in f:
            yield line.strip()

# Use __slots__ for memory-efficient classes
class Point:
    """Memory-efficient point class."""
    __slots__ = ['x', 'y']
    
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

# Use weak references to avoid circular references
import weakref

class Cache:
    """Cache with weak references."""
    
    def __init__(self):
        self._cache = weakref.WeakValueDictionary()
    
    def get(self, key):
        return self._cache.get(key)
    
    def set(self, key, value):
        self._cache[key] = value
```

---

[Previous Chapter](10-performance.md) | [Next Chapter](12-advanced.md)
