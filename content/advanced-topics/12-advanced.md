# Advanced Python Concepts (Iterators, Generators, Decorators, Metaclasses)

## Iterators and Iterables

### Understanding Iteration Protocol
```python
# Understanding the iteration protocol in Python: the foundation of all iteration
# Iterable: Object that can be iterated over (must have __iter__ method that returns an iterator)
# Iterator: Object that implements both __iter__() and __next__() methods for step-by-step iteration

class NumberIterator:
    """Custom iterator class that generates numbers in a specified range with memory efficiency."""
    
    def __init__(self, start: int, end: int):
        self.start = start    # Starting number for the sequence (inclusive)
        self.end = end        # Ending number for the sequence (exclusive)
        self.current = start  # Current position in the sequence (tracks iteration state)
    
    def __iter__(self):
        return self  # Return self as the iterator object (this class is both iterable and iterator)
    
    def __next__(self):
        if self.current >= self.end:  # Check if we've reached the end of the sequence
            raise StopIteration       # Signal that iteration is complete (Python's iteration protocol)
        result = self.current         # Get current number before advancing
        self.current += 1             # Move to next number in sequence
        return result                 # Return current number to the caller

# Usage: automatic iteration with for loop (most common pattern)
numbers = NumberIterator(1, 5)  # Create iterator for range 1-4 (exclusive)
for num in numbers:             # Python automatically calls __iter__ and __next__ behind the scenes
    print(num)                  # Output: 1, 2, 3, 4 (each number printed on separate line)

# Manual iteration: explicit control over iteration process (advanced usage)
iterator = iter([1, 2, 3, 4, 5])  # Create iterator from built-in list using iter() function
print(next(iterator))              # Manually get next value: 1 (explicit iteration control)
print(next(iterator))              # Manually get next value: 2 (continue iteration)
print(next(iterator))              # Manually get next value: 3 (continue iteration)
```

### Custom Iterable Classes
```python
class Sentence:
    """Custom iterable class that can be iterated over word by word with separation of concerns."""
    
    def __init__(self, text: str):
        self.text = text           # Store the original text string for reference
        self.words = text.split()  # Split text into list of words (pre-processing)
    
    def __iter__(self):
        return SentenceIterator(self.words)  # Return new iterator instance (creates fresh iteration state)

class SentenceIterator:
    """Iterator class that provides word-by-word iteration over a sentence with state management."""
    
    def __init__(self, words):
        self.words = words  # List of words to iterate over (data source)
        self.index = 0      # Current position in the word list (iteration state)
    
    def __next__(self):
        if self.index >= len(self.words):  # Check if we've processed all words in the list
            raise StopIteration            # Signal end of iteration (Python iteration protocol)
        result = self.words[self.index]    # Get current word at current index
        self.index += 1                    # Move to next word (advance iteration state)
        return result                      # Return current word to the caller
    
    def __iter__(self):
        return self  # Return self as the iterator object (this class is both iterable and iterator)

# Usage: demonstrate the custom iterable class with automatic iteration
sentence = Sentence("Hello world from Python")  # Create sentence object with text
for word in sentence:                           # Iterate over words automatically using for loop
    print(word)                                 # Output: Hello, world, from, Python (each word on separate line)

# Alternative: Generator-based implementation (more Pythonic and memory efficient)
class SentenceGenerator:
    """Iterable class using generator function for word iteration with lazy evaluation."""
    
    def __init__(self, text: str):
        self.text = text  # Store the text string (no pre-processing needed)
    
    def __iter__(self):
        for word in self.text.split():  # Iterate over words in text (lazy evaluation)
            yield word                  # Yield each word (generator pattern - memory efficient)

# Usage: demonstrate the generator-based iterable with same interface
sentence_gen = SentenceGenerator("Hello world from Python")  # Create generator-based sentence object
for word in sentence_gen:                                    # Iterate over words (same interface as above)
    print(word)                                              # Same output as above (Hello, world, from, Python)
```

## Generators

### Generator Functions
```python
def fibonacci_generator(n: int):
    """Generate Fibonacci numbers up to a maximum value n using memory-efficient generator pattern."""
    a, b = 0, 1  # Initialize first two Fibonacci numbers (F(0) = 0, F(1) = 1)
    while a < n:  # Continue while current number is less than the specified limit
        yield a   # Yield current Fibonacci number (pause execution and return value)
        a, b = b, a + b  # Calculate next Fibonacci number (a becomes b, b becomes a+b)

# Usage: generate Fibonacci sequence up to 100 with memory efficiency
fib = fibonacci_generator(100)  # Create generator object (no computation yet)
print(list(fib))               # Convert generator to list: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]

def countdown_generator(n: int):
    """Generate countdown sequence from n down to 1 using generator pattern."""
    while n > 0:  # Continue while n is greater than 0
        yield n   # Yield current number (pause execution and return value)
        n -= 1    # Decrement counter for next iteration

# Usage: generate countdown from 5 to 1 with automatic iteration
for num in countdown_generator(5):  # Iterate over countdown sequence automatically
    print(num)                      # Output: 5, 4, 3, 2, 1 (each number on separate line)
```

### Generator Expressions
```python
# Generator expressions: memory-efficient way to create iterables with lazy evaluation
squares_gen = (x**2 for x in range(1000000))  # Creates generator object, doesn't compute all values immediately

# vs List comprehension: memory-intensive, computes all values immediately (eager evaluation)
squares_list = [x**2 for x in range(1000000)]  # Creates list with all 1M squared numbers in memory

# Generator function for processing large files efficiently without memory issues
def read_large_file(filename: str):
    """Read large file line by line without loading entire file into memory using generator pattern."""
    with open(filename, 'r') as f:  # Open file in read mode with automatic cleanup
        for line in f:              # Iterate over file lines (memory efficient - one line at a time)
            yield line.strip()      # Yield each line with whitespace removed (lazy processing)

# Usage: process large file without memory issues using generator
for line in read_large_file('large_file.txt'):  # Process one line at a time (memory efficient)
    process_line(line)                           # Process each line individually (streaming approach)
```

### Advanced Generator Patterns
```python
def infinite_counter():
    """Infinite counter generator that yields numbers indefinitely."""
    num = 0  # Start counting from 0
    while True:  # Infinite loop (generator will be controlled by consumer)
        yield num  # Yield current number and pause execution
        num += 1   # Increment counter for next iteration

def take(iterable, n: int):
    """Take first n items from iterable using generator pattern."""
    for i, item in enumerate(iterable):  # Iterate over items with index
        if i >= n:  # Check if we've taken enough items
            break   # Stop iteration when limit reached
        yield item  # Yield current item

def drop(iterable, n: int):
    """Drop first n items from iterable and yield remaining items."""
    for i, item in enumerate(iterable):  # Iterate over items with index
        if i >= n:  # Skip first n items
            yield item  # Yield remaining items after skipping

# Usage: demonstrate generator composition
counter = infinite_counter()  # Create infinite counter generator
first_5 = take(counter, 5)    # Take first 5 items from infinite counter
print(list(first_5))          # [0, 1, 2, 3, 4] (finite result from infinite generator)

# Pipeline pattern: chain multiple generators for complex data processing
def pipeline(*generators):
    """Chain multiple generators into a single processing pipeline."""
    def chain(iterable):  # Inner function that processes the iterable
        for gen in generators:  # Apply each generator in sequence
            iterable = gen(iterable)  # Transform iterable through each generator
        yield from iterable  # Yield all results from final generator
    return chain  # Return the chained function

# Example pipeline components: modular generator functions
def filter_even(iterable):
    """Filter to keep only even numbers from iterable."""
    for item in iterable:  # Iterate over input items
        if item % 2 == 0:  # Check if item is even
            yield item     # Yield only even items

def square(iterable):
    """Square each item in the iterable."""
    for item in iterable:  # Iterate over input items
        yield item ** 2    # Yield squared value of each item

# Usage: demonstrate pipeline pattern with multiple transformations
numbers = range(10)                    # Input data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
pipeline_func = pipeline(filter_even, square, take)  # Create pipeline: filter → square → take
result = pipeline_func(numbers, 3)     # Apply pipeline: even numbers → squared → first 3
print(list(result))                    # [0, 4, 16] (squares of first 3 even numbers)
```

## Advanced Decorators

### Decorators with Arguments
```python
import functools  # Import functools for decorator utilities
import time      # Import time for timing operations

def retry(max_attempts: int = 3, delay: float = 1.0):
    """Decorator with arguments for retrying functions with configurable retry logic."""
    def decorator(func):  # Inner decorator function that takes the function to decorate
        @functools.wraps(func)  # Preserve function metadata (name, docstring, etc.)
        def wrapper(*args, **kwargs):  # Wrapper function that handles retry logic
            last_exception = None  # Track the last exception for final error reporting
            
            for attempt in range(max_attempts):  # Try up to max_attempts times
                try:
                    return func(*args, **kwargs)  # Execute the original function
                except Exception as e:  # Catch any exception that occurs
                    last_exception = e  # Store the exception for potential re-raising
                    if attempt < max_attempts - 1:  # If not the last attempt
                        time.sleep(delay)  # Wait before retrying
                        print(f"Attempt {attempt + 1} failed, retrying...")  # Log retry attempt
            
            raise last_exception  # Re-raise the last exception if all attempts failed
        return wrapper  # Return the wrapper function
    return decorator  # Return the decorator function

# Usage: demonstrate retry decorator with custom parameters
@retry(max_attempts=3, delay=0.5)  # Apply retry decorator with 3 attempts and 0.5s delay
def unreliable_function():
    import random
    if random.random() < 0.7:  # 70% chance of failure (for demonstration)
        raise ValueError("Random failure")  # Simulate random failure
    return "Success!"  # Return success message

# Decorator factory: create decorators that accept validation functions
def validate_input(*validators):
    """Decorator factory for input validation with multiple validator functions."""
    def decorator(func):  # Inner decorator function
        @functools.wraps(func)  # Preserve function metadata
        def wrapper(*args, **kwargs):  # Wrapper function that validates inputs
            # Validate arguments: apply each validator to corresponding argument
            for i, validator in enumerate(validators):  # Iterate through validators
                if i < len(args):  # Check if we have enough arguments
                    validator(args[i])  # Apply validator to argument
            return func(*args, **kwargs)  # Execute original function if validation passes
        return wrapper  # Return the wrapper function
    return decorator  # Return the decorator function

# Usage: demonstrate input validation decorator
def is_positive(x):  # Validator function for positive numbers
    if x <= 0:  # Check if value is not positive
        raise ValueError("Must be positive")  # Raise error for invalid input

@validate_input(is_positive, is_positive)  # Apply validation to both arguments
def divide(a, b):  # Function that requires positive inputs
    return a / b  # Perform division (validation ensures positive inputs)
```

### Class-Based Decorators
```python
class Timer:
    """Class-based decorator for timing functions."""
    
    def __init__(self, func):
        self.func = func
        self.calls = 0
    
    def __call__(self, *args, **kwargs):
        self.calls += 1
        start_time = time.time()
        result = self.func(*args, **kwargs)
        end_time = time.time()
        print(f"{self.func.__name__} took {end_time - start_time:.4f} seconds")
        return result

# Usage
@Timer
def slow_function():
    time.sleep(1)
    return "Done"

# Class-based decorator with arguments
class Cache:
    """Class-based decorator with arguments."""
    
    def __init__(self, max_size: int = 100):
        self.max_size = max_size
        self.cache = {}
    
    def __call__(self, func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            key = str(args) + str(sorted(kwargs.items()))
            
            if key in self.cache:
                return self.cache[key]
            
            result = func(*args, **kwargs)
            
            if len(self.cache) >= self.max_size:
                # Remove oldest item
                oldest_key = next(iter(self.cache))
                del self.cache[oldest_key]
            
            self.cache[key] = result
            return result
        return wrapper

# Usage
@Cache(max_size=50)
def expensive_calculation(n):
    time.sleep(1)  # Simulate expensive operation
    return n * n
```

### Property Decorators
```python
class Circle:
    """Circle class with property decorators."""
    
    def __init__(self, radius: float):
        self._radius = radius
    
    @property
    def radius(self):
        """Get radius."""
        return self._radius
    
    @radius.setter
    def radius(self, value):
        """Set radius with validation."""
        if value <= 0:
            raise ValueError("Radius must be positive")
        self._radius = value
    
    @property
    def area(self):
        """Calculate area (read-only property)."""
        import math
        return math.pi * self._radius ** 2
    
    @property
    def circumference(self):
        """Calculate circumference (read-only property)."""
        import math
        return 2 * math.pi * self._radius

# Usage
circle = Circle(5)
print(circle.area)  # 78.54...
print(circle.circumference)  # 31.42...

circle.radius = 10  # Uses setter
# circle.area = 100  # Error: can't set read-only property
```

## Context Managers

### Custom Context Managers
```python
class DatabaseConnection:
    """Custom context manager for database connections."""
    
    def __init__(self, host: str, port: int):
        self.host = host
        self.port = port
        self.connection = None
    
    def __enter__(self):
        print(f"Connecting to {self.host}:{self.port}")
        self.connection = "connected"  # Simulate connection
        return self.connection
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Closing connection")
        self.connection = None
        if exc_type:
            print(f"Error occurred: {exc_val}")
        return False  # Re-raise exception

# Usage
with DatabaseConnection("localhost", 5432) as conn:
    print(f"Using connection: {conn}")
    # Connection automatically closed after block

# Context manager for timing
class Timer:
    """Context manager for timing code blocks."""
    
    def __init__(self, name: str):
        self.name = name
    
    def __enter__(self):
        self.start_time = time.time()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.end_time = time.time()
        print(f"{self.name} took {self.end_time - self.start_time:.4f} seconds")

# Usage
with Timer("data processing"):
    time.sleep(1)  # Simulate work
```

### Context Manager with Contextlib
```python
from contextlib import contextmanager

@contextmanager
def managed_resource():
    """Simple context manager using contextlib."""
    print("Acquiring resource")
    resource = "resource"
    try:
        yield resource
    finally:
        print("Releasing resource")

# Usage
with managed_resource() as resource:
    print(f"Using {resource}")

# Context manager with error handling
@contextmanager
def error_handler(operation_name: str):
    """Context manager for consistent error handling."""
    try:
        yield
    except Exception as e:
        print(f"Error in {operation_name}: {e}")
        raise

# Usage
with error_handler("data processing"):
    # Some operation that might fail
    result = 1 / 0
```

### Nested Context Managers
```python
class FileManager:
    """Context manager for file operations."""
    
    def __init__(self, filename: str, mode: str = 'r'):
        self.filename = filename
        self.mode = mode
        self.file = None
    
    def __enter__(self):
        self.file = open(self.filename, self.mode)
        return self.file
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.file:
            self.file.close()

# Nested context managers
with Timer("file operations"):
    with FileManager("input.txt", "r") as input_file:
        with FileManager("output.txt", "w") as output_file:
            content = input_file.read()
            output_file.write(content.upper())

# Multiple context managers in one line (Python 3.10+)
# with Timer("file operations"), FileManager("input.txt") as input_file, FileManager("output.txt", "w") as output_file:
#     content = input_file.read()
#     output_file.write(content.upper())
```

## Metaclasses

### Understanding Metaclasses
```python
# Metaclass: Class that creates classes
# type() is the default metaclass

class MetaExample(type):
    """Custom metaclass example."""
    
    def __new__(cls, name, bases, namespace):
        print(f"Creating class: {name}")
        return super().__new__(cls, name, bases, namespace)
    
    def __init__(cls, name, bases, namespace):
        print(f"Initializing class: {name}")
        super().__init__(name, bases, namespace)

# Using metaclass
class MyClass(metaclass=MetaExample):
    pass

# Output:
# Creating class: MyClass
# Initializing class: MyClass
```

### Metaclass for Automatic Registration
```python
class RegistryMeta(type):
    """Metaclass for automatic class registration."""
    
    def __new__(cls, name, bases, namespace):
        # Create the class
        new_class = super().__new__(cls, name, bases, namespace)
        
        # Register the class if it has a 'name' attribute
        if hasattr(new_class, 'name'):
            if not hasattr(cls, '_registry'):
                cls._registry = {}
            cls._registry[new_class.name] = new_class
        
        return new_class

class Animal(metaclass=RegistryMeta):
    """Base class for animals."""
    pass

class Dog(Animal):
    name = "dog"
    
    def speak(self):
        return "Woof!"

class Cat(Animal):
    name = "cat"
    
    def speak(self):
        return "Meow!"

# Usage
print(Animal._registry)  # {'dog': <class '__main__.Dog'>, 'cat': <class '__main__.Cat'>}

# Factory function using registry
def create_animal(animal_type: str):
    return Animal._registry[animal_type]()

dog = create_animal("dog")
print(dog.speak())  # Woof!
```

### Metaclass for Method Validation
```python
class ValidationMeta(type):
    """Metaclass for method validation."""
    
    def __new__(cls, name, bases, namespace):
        # Validate required methods
        required_methods = ['validate', 'process']
        
        for method in required_methods:
            if method not in namespace:
                raise TypeError(f"Class {name} must implement {method} method")
        
        return super().__new__(cls, name, bases, namespace)

class DataProcessor(metaclass=ValidationMeta):
    """Data processor with required methods."""
    
    def validate(self, data):
        return isinstance(data, (list, tuple))
    
    def process(self, data):
        if self.validate(data):
            return sum(data)
        raise ValueError("Invalid data")

# This would raise an error:
# class InvalidProcessor(metaclass=ValidationMeta):
#     pass  # Missing required methods
```

## Descriptors

### Understanding Descriptors
```python
# Descriptor: Object with __get__, __set__, or __delete__ methods

class DescriptorExample:
    """Simple descriptor example."""
    
    def __get__(self, instance, owner):
        print(f"Getting value from {instance}")
        return instance._value
    
    def __set__(self, instance, value):
        print(f"Setting value to {value}")
        instance._value = value
    
    def __delete__(self, instance):
        print("Deleting value")
        del instance._value

class MyClass:
    descriptor = DescriptorExample()
    
    def __init__(self, value):
        self._value = value

# Usage
obj = MyClass(42)
print(obj.descriptor)  # Getting value from <__main__.MyClass object>
obj.descriptor = 100   # Setting value to 100
del obj.descriptor     # Deleting value
```

### Property Descriptor
```python
class Property:
    """Property descriptor implementation."""
    
    def __init__(self, fget=None, fset=None, fdel=None, doc=None):
        self.fget = fget
        self.fset = fset
        self.fdel = fdel
        self.__doc__ = doc
    
    def __get__(self, instance, owner):
        if instance is None:
            return self
        if self.fget is None:
            raise AttributeError("unreadable attribute")
        return self.fget(instance)
    
    def __set__(self, instance, value):
        if self.fset is None:
            raise AttributeError("can't set attribute")
        self.fset(instance, value)
    
    def __delete__(self, instance):
        if self.fdel is None:
            raise AttributeError("can't delete attribute")
        self.fdel(instance)

class Temperature:
    def __init__(self):
        self._celsius = 0
    
    def get_celsius(self):
        return self._celsius
    
    def set_celsius(self, value):
        if value < -273.15:
            raise ValueError("Temperature below absolute zero")
        self._celsius = value
    
    celsius = Property(get_celsius, set_celsius)

# Usage
temp = Temperature()
temp.celsius = 25
print(temp.celsius)  # 25
```

### Cached Property Descriptor
```python
class CachedProperty:
    """Descriptor for cached property."""
    
    def __init__(self, func):
        self.func = func
        self.name = func.__name__
    
    def __get__(self, instance, owner):
        if instance is None:
            return self
        
        # Check if value is cached
        if not hasattr(instance, '_cache'):
            instance._cache = {}
        
        if self.name not in instance._cache:
            instance._cache[self.name] = self.func(instance)
        
        return instance._cache[self.name]

class ExpensiveCalculator:
    def __init__(self, data):
        self.data = data
    
    @CachedProperty
    def expensive_result(self):
        """Expensive calculation that should be cached."""
        print("Performing expensive calculation...")
        time.sleep(1)  # Simulate expensive operation
        return sum(self.data) ** 2

# Usage
calc = ExpensiveCalculator([1, 2, 3, 4, 5])
print(calc.expensive_result)  # Performs calculation
print(calc.expensive_result)  # Uses cached value
```

### Validator Descriptor
```python
class Validated:
    """Descriptor for validated attributes."""
    
    def __init__(self, validator=None, default=None):
        self.validator = validator
        self.default = default
        self.name = None
    
    def __set_name__(self, owner, name):
        self.name = name
    
    def __get__(self, instance, owner):
        if instance is None:
            return self
        return instance.__dict__.get(self.name, self.default)
    
    def __set__(self, instance, value):
        if self.validator:
            value = self.validator(value)
        instance.__dict__[self.name] = value

def positive_int(value):
    """Validator for positive integers."""
    value = int(value)
    if value <= 0:
        raise ValueError("Value must be positive")
    return value

class Product:
    price = Validated(positive_int)
    quantity = Validated(positive_int, default=1)
    
    def __init__(self, price, quantity=None):
        self.price = price
        if quantity is not None:
            self.quantity = quantity

# Usage
product = Product(10, 5)
print(product.price)    # 10
print(product.quantity) # 5

# This would raise an error:
# product.price = -5  # ValueError: Value must be positive
```

---

[Previous Chapter](11-bestpractices.md) | [Next Chapter](13-concurrency.md)
