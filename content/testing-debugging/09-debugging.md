# Debugging (Logging, Exceptions, pdb)

## Logging

### Basic Logging Setup
```python
import logging  # Import logging module for application logging

# Basic configuration: set up logging with file and console output
logging.basicConfig(
    level=logging.INFO,  # Set minimum log level (INFO and above will be logged)
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',  # Define log message format
    handlers=[
        logging.FileHandler('app.log'),  # Log to file (persistent storage)
        logging.StreamHandler()          # Log to console (stdout)
    ]
)

logger = logging.getLogger(__name__)  # Create logger for current module

# Usage: different log levels for different types of messages
logger.debug("Debug message")    # Detailed information for debugging (not shown with INFO level)
logger.info("Info message")      # General information about program execution
logger.warning("Warning message")  # Warning about potential issues
logger.error("Error message")    # Error that doesn't stop the program
logger.critical("Critical message")  # Critical error that may cause program failure
```

### Advanced Logging Configuration
```python
import logging  # Import logging module for application logging
from logging.handlers import RotatingFileHandler, TimedRotatingFileHandler  # Import advanced handlers

# Create logger: set up named logger for application
logger = logging.getLogger('myapp')  # Create logger with specific name
logger.setLevel(logging.DEBUG)  # Set minimum log level (DEBUG and above will be logged)

# Create formatters: define detailed log message format
formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s'  # Include function name and line number
)

# File handler with rotation: prevent log files from growing too large
file_handler = RotatingFileHandler(
    'app.log', 
    maxBytes=1024*1024,  # 1MB maximum file size before rotation
    backupCount=5        # Keep 5 backup files (app.log.1, app.log.2, etc.)
)
file_handler.setLevel(logging.INFO)  # Set file handler level (INFO and above)
file_handler.setFormatter(formatter)  # Apply formatter to file handler

# Console handler: output logs to console for development
console_handler = logging.StreamHandler()  # Create console output handler
console_handler.setLevel(logging.DEBUG)  # Set console handler level (DEBUG and above)
console_handler.setFormatter(formatter)  # Apply formatter to console handler

# Add handlers to logger: register handlers with logger
logger.addHandler(file_handler)  # Add file handler to logger
logger.addHandler(console_handler)  # Add console handler to logger
```

### Structured Logging
```python
import logging  # Import logging module for application logging
import json     # Import json module for JSON formatting
from datetime import datetime  # Import datetime for timestamp formatting

class JSONFormatter(logging.Formatter):
    """Custom formatter that outputs logs in JSON format for structured logging."""
    def format(self, record):
        # Create structured log entry with standard fields
        log_entry = {
            'timestamp': datetime.utcnow().isoformat(),  # ISO format timestamp in UTC
            'level': record.levelname,                   # Log level (INFO, ERROR, etc.)
            'logger': record.name,                       # Logger name
            'message': record.getMessage(),              # Log message
            'module': record.module,                     # Module name
            'function': record.funcName,                 # Function name
            'line': record.lineno                        # Line number
        }
        
        # Add extra fields if present (custom context data)
        if hasattr(record, 'user_id'):  # Check if user_id was provided
            log_entry['user_id'] = record.user_id  # Add user ID to log entry
        if hasattr(record, 'request_id'):  # Check if request_id was provided
            log_entry['request_id'] = record.request_id  # Add request ID to log entry
            
        return json.dumps(log_entry)  # Convert to JSON string

# Setup JSON logging: configure logger with JSON formatter
logger = logging.getLogger('api')  # Create logger for API module
handler = logging.StreamHandler()  # Create console handler
handler.setFormatter(JSONFormatter())  # Apply JSON formatter to handler
logger.addHandler(handler)  # Add handler to logger
logger.setLevel(logging.INFO)  # Set log level

# Usage with extra context: include additional data in log messages
logger.info("User login", extra={'user_id': 123, 'request_id': 'req-456'})  # Log with context data
```

### Logging Best Practices
```python
import logging  # Import logging module for application logging
import functools  # Import functools for decorator utilities

# Create logger for each module: follow the one-logger-per-module pattern
logger = logging.getLogger(__name__)  # Create logger for current module

def log_function_call(func):
    """Decorator to log function calls with automatic error handling."""
    @functools.wraps(func)  # Preserve function metadata (name, docstring, etc.)
    def wrapper(*args, **kwargs):
        logger.debug(f"Calling {func.__name__} with args={args}, kwargs={kwargs}")  # Log function entry
        try:
            result = func(*args, **kwargs)  # Execute the original function
            logger.debug(f"{func.__name__} returned {result}")  # Log successful return
            return result  # Return the function result
        except Exception as e:  # Catch any exception
            logger.error(f"{func.__name__} failed with error: {e}", exc_info=True)  # Log error with stack trace
            raise  # Re-raise the exception (preserve original behavior)
    return wrapper  # Return the wrapped function

@log_function_call  # Apply the logging decorator
def process_data(data):
    # Function implementation
    return data.upper()  # Convert string to uppercase

# Context manager for logging: automatically log start and end of operations
class LogContext:
    def __init__(self, logger, context):
        self.logger = logger  # Logger instance to use
        self.context = context  # Context description for logging
    
    def __enter__(self):
        self.logger.info(f"Starting: {self.context}")  # Log operation start
        return self  # Return self for context manager
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type:  # Check if an exception occurred
            self.logger.error(f"Error in {self.context}: {exc_val}", exc_info=True)  # Log error with stack trace
        else:
            self.logger.info(f"Completed: {self.context}")  # Log successful completion

# Usage: demonstrate logging decorator and context manager
with LogContext(logger, "data processing"):  # Use context manager for operation logging
    process_data("test")  # Call decorated function
```

## Exception Handling

### Basic Exception Handling
```python
try:
    result = 10 / 0  # This will raise a ZeroDivisionError
except ZeroDivisionError as e:  # Catch specific division by zero error
    print(f"Division by zero: {e}")  # Handle division by zero specifically
except ValueError as e:  # Catch value errors (won't be reached in this example)
    print(f"Value error: {e}")  # Handle value errors
except Exception as e:  # Catch any other unexpected exceptions
    print(f"Unexpected error: {e}")  # Handle unexpected errors
else:
    print("No exceptions occurred")  # Execute only if no exception was raised
finally:
    print("This always executes")  # Always execute (cleanup code)
```

### Custom Exceptions
```python
class ValidationError(Exception):
    """Custom exception for validation errors with field context."""
    def __init__(self, message, field=None):
        self.message = message  # Error message
        self.field = field      # Field name that failed validation
        super().__init__(self.message)  # Call parent constructor

class DatabaseError(Exception):
    """Custom exception for database errors with query context."""
    def __init__(self, message, query=None):
        self.message = message  # Error message
        self.query = query      # SQL query that caused the error
        super().__init__(self.message)  # Call parent constructor

# Usage: demonstrate custom exception handling
def validate_age(age):
    if not isinstance(age, int):  # Check if age is an integer
        raise ValidationError("Age must be an integer", "age")  # Raise custom exception with field context
    if age < 0 or age > 150:  # Check if age is within valid range
        raise ValidationError("Age must be between 0 and 150", "age")  # Raise custom exception with field context
    return age  # Return valid age

try:
    validate_age("invalid")  # This will raise ValidationError
except ValidationError as e:  # Catch custom validation error
    print(f"Validation error in field '{e.field}': {e.message}")  # Print field-specific error message
```

### Exception Chaining
```python
def process_file(filename):
    try:
        with open(filename, 'r') as f:  # Try to open and read file
            return f.read()  # Return file contents
    except FileNotFoundError as e:  # Catch file not found error
        raise RuntimeError(f"Could not process file {filename}") from e  # Chain exception with original cause

# Usage: demonstrate exception chaining
try:
    content = process_file("nonexistent.txt")  # This will raise RuntimeError
except RuntimeError as e:  # Catch the chained exception
    print(f"Error: {e}")  # Print the new exception message
    print(f"Original error: {e.__cause__}")  # Print the original exception that caused it
```

### Context Managers for Exception Handling
```python
from contextlib import contextmanager  # Import contextmanager decorator

@contextmanager
def error_handler(logger, operation_name):
    """Context manager for consistent error handling and logging."""
    try:
        yield  # Execute the code block within the context manager
    except Exception as e:  # Catch any exception that occurs
        logger.error(f"Error in {operation_name}: {e}", exc_info=True)  # Log error with stack trace
        raise  # Re-raise the exception (preserve original behavior)

# Usage: demonstrate error handling context manager
with error_handler(logger, "data processing"):  # Use context manager for automatic error logging
    process_data()  # Execute code that might raise exceptions
```

## Assertions

### Basic Assertions
```python
def divide(a, b):
    assert b != 0, "Division by zero is not allowed"  # Assertion with custom error message
    return a / b  # Safe division (assertion ensures b is not zero)

def validate_age(age):
    assert isinstance(age, int), "Age must be an integer"  # Assertion for type checking
    assert 0 <= age <= 150, "Age must be between 0 and 150"  # Assertion for range validation
    return age  # Return valid age

# Assertions with custom messages: validate function preconditions
def process_list(items):
    assert len(items) > 0, "List cannot be empty"  # Assertion for non-empty list
    assert all(isinstance(item, str) for item in items), "All items must be strings"  # Assertion for type consistency
    return [item.upper() for item in items]  # Process list (assertions ensure valid input)
```

### Debug Assertions
```python
import sys  # Import sys module for system-specific parameters

def debug_assert(condition, message=""):
    """Assertion that only runs in debug mode (when __debug__ is True)."""
    if __debug__:  # Check if Python is running in debug mode
        assert condition, message  # Only execute assertion in debug mode

# Usage: demonstrate debug-only assertions
def calculate_square_root(n):
    debug_assert(n >= 0, "Cannot calculate square root of negative number")  # Debug-only validation
    return n ** 0.5  # Calculate square root (assertion ensures non-negative input)

# Disable assertions (not recommended in production)
# python -O script.py  # Run with optimization flag to disable assertions
```

## Python Debugger (pdb)

### Basic pdb Usage
```python
import pdb  # Import Python debugger module

def complex_function(x, y):
    result = x + y  # Calculate sum
    pdb.set_trace()  # Debugger will stop here (interactive debugging session starts)
    result *= 2  # Multiply result by 2
    return result  # Return final result

# Alternative using breakpoint() (Python 3.7+)
def another_function():
    x = 1  # Initialize x
    y = 2  # Initialize y
    breakpoint()  # Same as pdb.set_trace() (modern Python syntax)
    return x + y  # Return sum
```

### pdb Commands
```python
# Common pdb commands:
# h(elp) - Show help
# n(ext) - Execute the next line
# s(tep) - Step into function calls
# c(ontinue) - Continue execution
# l(ist) - Show current location in code
# p <variable> - Print variable value
# pp <variable> - Pretty print variable
# w(here) - Show call stack
# u(p) - Move up in call stack
# d(own) - Move down in call stack
# q(uit) - Quit debugger

def debug_example():
    x = 10
    y = 20
    breakpoint()  # Debugger stops here
    z = x + y
    print(f"Result: {z}")
    return z
```

### Advanced pdb Usage
```python
import pdb

class MyDebugger(pdb.Pdb):
    def user_line(self, frame):
        """Custom behavior when stopping at a line"""
        print(f"Stopped at line {frame.f_lineno}")
        print(f"Local variables: {frame.f_locals}")
        super().user_line(frame)

def debug_with_custom_pdb():
    x = [1, 2, 3, 4, 5]
    y = sum(x)
    
    debugger = MyDebugger()
    debugger.set_trace()
    
    result = y * 2
    return result
```

## Debugging Tools and Techniques

### Print Debugging
```python
def debug_with_print():
    x = 10
    print(f"DEBUG: x = {x}")  # Simple print debugging
    
    y = x * 2
    print(f"DEBUG: y = {y}")
    
    result = y + 5
    print(f"DEBUG: result = {result}")
    return result

# Better print debugging with context
def debug_with_context():
    import inspect
    
    def debug_print(message, *args):
        frame = inspect.currentframe().f_back
        filename = frame.f_code.co_filename
        line_no = frame.f_lineno
        func_name = frame.f_code.co_name
        
        print(f"DEBUG [{filename}:{line_no} in {func_name}] {message}")
        if args:
            print(f"  Values: {args}")
    
    x = 10
    debug_print("Processing x", x)
    
    y = x * 2
    debug_print("Calculated y", y)
    
    return y
```

### Using sys.settrace for Advanced Debugging
```python
import sys

def trace_function(frame, event, arg):
    """Custom trace function for debugging"""
    if event == 'line':
        filename = frame.f_code.co_filename
        line_no = frame.f_lineno
        func_name = frame.f_code.co_name
        
        print(f"Line {line_no} in {func_name} ({filename})")
        
        # Print local variables
        locals_dict = frame.f_locals
        if locals_dict:
            print(f"  Locals: {locals_dict}")
    
    return trace_function

def debug_with_trace():
    sys.settrace(trace_function)
    
    x = 10
    y = x * 2
    result = y + 5
    
    sys.settrace(None)  # Stop tracing
    return result
```

### Memory Debugging
```python
import sys
import gc
import tracemalloc

def debug_memory():
    # Start memory tracking
    tracemalloc.start()
    
    # Your code here
    data = [i for i in range(1000000)]
    
    # Get memory snapshot
    snapshot = tracemalloc.take_snapshot()
    
    # Show top memory users
    top_stats = snapshot.statistics('lineno')
    print("Top 10 memory users:")
    for stat in top_stats[:10]:
        print(stat)
    
    # Stop tracking
    tracemalloc.stop()

def get_object_size(obj):
    """Get the size of an object in bytes"""
    import sys
    return sys.getsizeof(obj)

# Usage
large_list = [i for i in range(100000)]
print(f"Size of large_list: {get_object_size(large_list)} bytes")
```

### Performance Debugging
```python
import time
import cProfile
import pstats
from functools import wraps

def timing_decorator(func):
    """Decorator to measure function execution time"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(f"{func.__name__} took {end_time - start_time:.4f} seconds")
        return result
    return wrapper

@timing_decorator
def slow_function():
    time.sleep(1)
    return "Done"

def profile_function(func, *args, **kwargs):
    """Profile a function using cProfile"""
    profiler = cProfile.Profile()
    profiler.enable()
    
    result = func(*args, **kwargs)
    
    profiler.disable()
    stats = pstats.Stats(profiler)
    stats.sort_stats('cumulative')
    stats.print_stats(10)  # Show top 10 functions
    
    return result

# Usage
def example_function():
    result = 0
    for i in range(1000000):
        result += i
    return result

profile_function(example_function)
```

## Debugging Best Practices

### Error Context and Information
```python
import logging
import traceback
from datetime import datetime

def log_error_with_context(error, context=None):
    """Log error with full context information"""
    logger = logging.getLogger(__name__)
    
    error_info = {
        'timestamp': datetime.utcnow().isoformat(),
        'error_type': type(error).__name__,
        'error_message': str(error),
        'traceback': traceback.format_exc(),
        'context': context or {}
    }
    
    logger.error(f"Error occurred: {error_info}")

def safe_execute(func, *args, **kwargs):
    """Safely execute a function with error logging"""
    try:
        return func(*args, **kwargs)
    except Exception as e:
        context = {
            'function': func.__name__,
            'args': args,
            'kwargs': kwargs
        }
        log_error_with_context(e, context)
        raise

# Usage
def risky_function(x, y):
    return x / y

result = safe_execute(risky_function, 10, 0)
```

### Debug Configuration
```python
import os
import logging

class DebugConfig:
    """Configuration class for debugging settings"""
    
    def __init__(self):
        self.debug_mode = os.getenv('DEBUG', 'False').lower() == 'true'
        self.log_level = os.getenv('LOG_LEVEL', 'INFO')
        self.enable_profiling = os.getenv('ENABLE_PROFILING', 'False').lower() == 'true'
    
    def setup_logging(self):
        """Setup logging based on configuration"""
        level = getattr(logging, self.log_level.upper())
        
        if self.debug_mode:
            logging.basicConfig(
                level=level,
                format='%(asctime)s - %(name)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s'
            )
        else:
            logging.basicConfig(
                level=level,
                format='%(asctime)s - %(levelname)s - %(message)s'
            )

# Usage
config = DebugConfig()
config.setup_logging()
```

---

[Previous Chapter](08-testing.md) | [Next Chapter](10-performance.md)
