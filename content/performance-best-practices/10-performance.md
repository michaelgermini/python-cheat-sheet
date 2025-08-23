# Performance & Optimization (Profiling, Memory, Async Basics)

## Profiling and Performance Analysis

### Using cProfile for Function Profiling
```python
import cProfile  # Import cProfile for function-level profiling
import pstats    # Import pstats for statistics analysis
import io        # Import io for string buffer operations

def profile_function(func, *args, **kwargs):
    """Profile a function and return detailed statistics about execution time."""
    profiler = cProfile.Profile()  # Create profiler instance
    profiler.enable()  # Start profiling
    
    result = func(*args, **kwargs)  # Execute the function to be profiled
    
    profiler.disable()  # Stop profiling
    
    # Create stats object: analyze profiling results
    s = io.StringIO()  # Create string buffer for output capture
    ps = pstats.Stats(profiler, stream=s).sort_stats('cumulative')  # Sort by cumulative time
    ps.print_stats(20)  # Show top 20 functions by execution time
    
    print(s.getvalue())  # Print profiling results
    return result  # Return original function result

# Example usage: demonstrate profiling with a slow function
def slow_function():
    result = 0  # Initialize result variable
    for i in range(1000000):  # Large loop for demonstration
        result += i  # Accumulate sum
    return result  # Return final sum

profile_function(slow_function)  # Profile the slow function
```

### Line-by-Line Profiling with line_profiler
```python
# Install: pip install line_profiler
from line_profiler import LineProfiler  # Import line profiler for line-by-line analysis

def expensive_function():
    result = []  # Initialize empty result list
    for i in range(10000):  # Outer loop
        # Expensive operation: create list comprehension
        data = [j * 2 for j in range(100)]  # Create list of doubled values
        result.extend(data)  # Extend result list with data
    return result  # Return accumulated result

# Profile the function: set up line-by-line profiling
profiler = LineProfiler()  # Create line profiler instance
profiler.add_function(expensive_function)  # Add function to be profiled
profiler.enable_by_count()  # Enable profiling for function calls

# Run the function: execute the expensive function
result = expensive_function()  # This will be profiled line by line

# Print results: display detailed line-by-line statistics
profiler.print_stats()  # Show execution time for each line
```

### Memory Profiling with tracemalloc
```python
import tracemalloc  # Import tracemalloc for memory tracking
import gc          # Import gc for garbage collection control

def profile_memory():
    """Profile memory usage of a function with detailed memory analysis."""
    tracemalloc.start()  # Start memory tracking
    
    # Your code here: execute code to be memory profiled
    data = [i for i in range(1000000)]  # Create large list for demonstration
    
    # Take snapshot: capture current memory state
    snapshot = tracemalloc.take_snapshot()  # Create memory snapshot
    
    # Show top memory users: analyze memory usage by line
    top_stats = snapshot.statistics('lineno')  # Group by line number
    print("Top 10 memory users:")  # Print header
    for stat in top_stats[:10]:  # Iterate through top 10 memory users
        print(stat)  # Print memory statistics for each line
    
    # Get current memory usage: retrieve memory statistics
    current, peak = tracemalloc.get_traced_memory()  # Get current and peak memory usage
    print(f"Current memory usage: {current / 1024 / 1024:.1f} MB")  # Convert to MB
    print(f"Peak memory usage: {peak / 1024 / 1024:.1f} MB")  # Convert to MB
    
    tracemalloc.stop()  # Stop memory tracking

# Usage: demonstrate memory profiling
profile_memory()  # Profile memory usage of the function
```

### Performance Timing with timeit
```python
import timeit  # Import timeit for accurate timing measurements
import time    # Import time for simple timing operations

# Simple timing: measure function execution time
def measure_time(func, *args, **kwargs):
    """Measure execution time of a function using time module."""
    start_time = time.time()  # Record start time
    result = func(*args, **kwargs)  # Execute the function
    end_time = time.time()  # Record end time
    
    print(f"{func.__name__} took {end_time - start_time:.4f} seconds")  # Print execution time
    return result  # Return original function result

# Using timeit module for more accurate measurements: compare different approaches
def compare_performance():
    """Compare performance of different approaches for creating lists."""
    
    # Method 1: List comprehension (most Pythonic)
    list_comp = timeit.timeit(
        '[x * 2 for x in range(1000)]',  # List comprehension approach
        number=10000  # Number of iterations for averaging
    )
    
    # Method 2: For loop (traditional approach)
    for_loop = timeit.timeit(
        '''
result = []
for x in range(1000):
    result.append(x * 2)
        ''',  # For loop approach
        number=10000  # Number of iterations for averaging
    )
    
    # Method 3: Map function (functional approach)
    map_func = timeit.timeit(
        'list(map(lambda x: x * 2, range(1000)))',  # Map function approach
        number=10000  # Number of iterations for averaging
    )
    
    print(f"List comprehension: {list_comp:.4f} seconds")  # Print list comprehension time
    print(f"For loop: {for_loop:.4f} seconds")  # Print for loop time
    print(f"Map function: {map_func:.4f} seconds")  # Print map function time

# Usage: demonstrate performance comparison
compare_performance()  # Compare different list creation methods
```

## Optimization Techniques

### List vs Generator Performance
```python
import sys   # Import sys for memory size operations
import time  # Import time for timing measurements

def compare_list_vs_generator():
    """Compare memory and performance of lists vs generators for large datasets."""
    
    # List approach: create full list in memory
    start_time = time.time()  # Record start time
    start_memory = sys.getsizeof([])  # Get initial memory usage
    
    numbers_list = [i for i in range(10000000)]  # Create full list of 10M numbers
    
    end_time = time.time()  # Record end time
    end_memory = sys.getsizeof(numbers_list)  # Get final memory usage
    
    list_time = end_time - start_time  # Calculate creation time
    list_memory = end_memory - start_memory  # Calculate memory increase
    
    # Generator approach: create generator object (lazy evaluation)
    start_time = time.time()  # Record start time
    start_memory = sys.getsizeof([])  # Get initial memory usage
    
    numbers_gen = (i for i in range(10000000))  # Create generator (no values stored yet)
    
    end_time = time.time()  # Record end time
    end_memory = sys.getsizeof(numbers_gen)  # Get final memory usage
    
    gen_time = end_time - start_time  # Calculate creation time
    gen_memory = end_memory - start_memory  # Calculate memory increase
    
    print(f"List creation: {list_time:.4f}s, Memory: {list_memory} bytes")  # Print list metrics
    print(f"Generator creation: {gen_time:.4f}s, Memory: {gen_memory} bytes")  # Print generator metrics
    
    # Memory usage when iterating: demonstrate actual memory consumption
    list_sum = sum(numbers_list)  # Sum all values (list already in memory)
    gen_sum = sum(numbers_gen)  # Sum all values (generator creates values on demand)
    
    print(f"List sum: {list_sum}")  # Print list sum result
    print(f"Generator sum: {gen_sum}")  # Print generator sum result

# Usage: demonstrate memory and performance comparison
compare_list_vs_generator()  # Compare list vs generator approaches
```

### Caching and Memoization
```python
import functools  # Import functools for decorator utilities
import time      # Import time for timing operations

# Simple memoization decorator: cache function results
def memoize(func):
    """Simple memoization decorator that caches function results."""
    cache = {}  # Dictionary to store cached results
    
    @functools.wraps(func)  # Preserve function metadata
    def wrapper(*args):  # Wrapper function that accepts any arguments
        if args not in cache:  # Check if result is not cached
            cache[args] = func(*args)  # Compute and cache the result
        return cache[args]  # Return cached result
    
    return wrapper  # Return the wrapper function

# Using functools.lru_cache (Python 3.2+): built-in caching decorator
@functools.lru_cache(maxsize=128)  # Cache up to 128 results
def fibonacci(n):
    """Calculate Fibonacci number with automatic caching."""
    if n < 2:  # Base cases
        return n  # Return n for 0 and 1
    return fibonacci(n-1) + fibonacci(n-2)  # Recursive calculation with caching

# Custom cache with TTL (Time To Live): cache with expiration
class TTLCache:
    """Cache with time-based expiration for temporary data."""
    def __init__(self, ttl_seconds=300):  # Default 5 minutes TTL
        self.cache = {}  # Dictionary to store cached items
        self.ttl = ttl_seconds  # Time to live in seconds
    
    def get(self, key):  # Retrieve item from cache
        if key in self.cache:  # Check if key exists
            value, timestamp = self.cache[key]  # Get value and timestamp
            if time.time() - timestamp < self.ttl:  # Check if not expired
                return value  # Return cached value
            else:
                del self.cache[key]  # Remove expired item
        return None  # Return None if not found or expired
    
    def set(self, key, value):  # Store item in cache
        self.cache[key] = (value, time.time())  # Store value with current timestamp

# Usage: demonstrate caching benefits
@memoize  # Apply custom memoization decorator
def expensive_calculation(n):
    time.sleep(1)  # Simulate expensive operation (1 second delay)
    return n * n  # Return square of input

# First call is slow: demonstrate caching effect
start = time.time()  # Record start time
result1 = expensive_calculation(5)  # First call (slow)
print(f"First call: {time.time() - start:.4f}s")  # Print execution time

# Second call is fast (cached): demonstrate cache hit
start = time.time()  # Record start time
result2 = expensive_calculation(5)  # Second call (fast - cached)
print(f"Second call: {time.time() - start:.4f}s")  # Print execution time
```

### String Concatenation Optimization
```python
import time  # Import time for timing measurements

def compare_string_methods():
    """Compare different string concatenation methods for performance analysis."""
    n = 10000  # Number of iterations for testing
    
    # Method 1: + operator (inefficient for many concatenations)
    start = time.time()  # Record start time
    result1 = ""  # Initialize empty string
    for i in range(n):  # Loop through numbers
        result1 += str(i)  # Concatenate strings (creates new string each time)
    time1 = time.time() - start  # Calculate execution time
    
    # Method 2: join with list (more efficient)
    start = time.time()  # Record start time
    parts = []  # Initialize empty list
    for i in range(n):  # Loop through numbers
        parts.append(str(i))  # Append strings to list
    result2 = "".join(parts)  # Join all parts at once
    time2 = time.time() - start  # Calculate execution time
    
    # Method 3: join with generator (memory efficient)
    start = time.time()  # Record start time
    result3 = "".join(str(i) for i in range(n))  # Generator expression with join
    time3 = time.time() - start  # Calculate execution time
    
    # Method 4: f-strings (Python 3.6+) (modern and readable)
    start = time.time()  # Record start time
    result4 = "".join(f"{i}" for i in range(n))  # F-string generator with join
    time4 = time.time() - start  # Calculate execution time
    
    print(f"+ operator: {time1:.4f}s")  # Print + operator performance
    print(f"join with list: {time2:.4f}s")  # Print list join performance
    print(f"join with generator: {time3:.4f}s")  # Print generator join performance
    print(f"f-strings: {time4:.4f}s")  # Print f-string performance

# Usage: demonstrate string concatenation performance comparison
compare_string_methods()  # Compare different string concatenation methods
```

### NumPy Vectorization
```python
import numpy as np
import time

def compare_vectorization():
    """Compare Python loops vs NumPy vectorization"""
    size = 1000000
    
    # Python loop
    start = time.time()
    python_result = []
    for i in range(size):
        python_result.append(i * 2 + 1)
    python_time = time.time() - start
    
    # NumPy vectorization
    start = time.time()
    numpy_result = np.arange(size) * 2 + 1
    numpy_time = time.time() - start
    
    print(f"Python loop: {python_time:.4f}s")
    print(f"NumPy vectorization: {numpy_time:.4f}s")
    print(f"Speedup: {python_time / numpy_time:.1f}x")

# Usage
compare_vectorization()
```

## Memory Management

### Garbage Collection
```python
import gc
import sys
import weakref

def memory_management_examples():
    """Examples of memory management techniques"""
    
    # Force garbage collection
    gc.collect()
    
    # Get garbage collection statistics
    stats = gc.get_stats()
    print("Garbage collection stats:", stats)
    
    # Check reference counts
    obj = [1, 2, 3]
    print(f"Reference count: {sys.getrefcount(obj)}")
    
    # Using weak references to avoid circular references
    class Cache:
        def __init__(self):
            self._cache = weakref.WeakValueDictionary()
        
        def get(self, key):
            return self._cache.get(key)
        
        def set(self, key, value):
            self._cache[key] = value
    
    cache = Cache()
    cache.set("key", "value")
    print(f"Cache size: {len(cache._cache)}")

# Usage
memory_management_examples()
```

### Memory-Efficient Iteration
```python
def memory_efficient_processing():
    """Examples of memory-efficient data processing"""
    
    # Reading large files line by line
    def process_large_file(filename):
        with open(filename, 'r') as f:
            for line in f:  # Memory efficient - one line at a time
                yield line.strip()
    
    # Processing large datasets in chunks
    def process_in_chunks(data, chunk_size=1000):
        for i in range(0, len(data), chunk_size):
            chunk = data[i:i + chunk_size]
            yield chunk
    
    # Using itertools for memory-efficient operations
    from itertools import islice, chain
    
    def memory_efficient_operations():
        # Slice without creating a copy
        large_list = list(range(1000000))
        first_100 = list(islice(large_list, 100))
        
        # Chain iterables without creating intermediate lists
        combined = chain(range(10), range(20, 30), range(40, 50))
        return list(combined)
    
    return process_large_file, process_in_chunks, memory_efficient_operations

# Usage
process_large_file, process_in_chunks, memory_efficient_operations = memory_efficient_processing()
```

## Async Programming Basics

### Basic Async/Await
```python
import asyncio
import time

async def async_function():
    """Basic async function"""
    print("Starting async function")
    await asyncio.sleep(1)  # Non-blocking sleep
    print("Async function completed")
    return "Async result"

async def multiple_async_tasks():
    """Run multiple async tasks concurrently"""
    # Create multiple tasks
    tasks = [
        async_function(),
        async_function(),
        async_function()
    ]
    
    # Run all tasks concurrently
    results = await asyncio.gather(*tasks)
    print(f"All tasks completed: {results}")

# Run async functions
async def main():
    print("Running single async function:")
    result = await async_function()
    print(f"Result: {result}")
    
    print("\nRunning multiple async tasks:")
    await multiple_async_tasks()

# Usage
asyncio.run(main())
```

### Async with aiohttp
```python
import aiohttp
import asyncio
import time

async def fetch_url(session, url):
    """Fetch a single URL asynchronously"""
    async with session.get(url) as response:
        return await response.text()

async def fetch_multiple_urls(urls):
    """Fetch multiple URLs concurrently"""
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_url(session, url) for url in urls]
        results = await asyncio.gather(*tasks)
        return results

async def compare_sync_vs_async():
    """Compare synchronous vs asynchronous HTTP requests"""
    urls = [
        'https://httpbin.org/delay/1',
        'https://httpbin.org/delay/1',
        'https://httpbin.org/delay/1'
    ]
    
    # Async approach
    start_time = time.time()
    results = await fetch_multiple_urls(urls)
    async_time = time.time() - start_time
    
    print(f"Async requests took: {async_time:.2f} seconds")
    print(f"Retrieved {len(results)} responses")

# Usage
asyncio.run(compare_sync_vs_async())
```

### Async Context Managers
```python
import asyncio
import aiofiles

async def async_file_operations():
    """Example of async file operations"""
    
    # Async file reading
    async with aiofiles.open('example.txt', 'r') as f:
        content = await f.read()
    
    # Async file writing
    async with aiofiles.open('output.txt', 'w') as f:
        await f.write(content.upper())
    
    return content

# Custom async context manager
class AsyncResource:
    async def __aenter__(self):
        print("Acquiring async resource")
        await asyncio.sleep(0.1)  # Simulate async setup
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        print("Releasing async resource")
        await asyncio.sleep(0.1)  # Simulate async cleanup

async def use_async_context_manager():
    async with AsyncResource() as resource:
        print("Using async resource")
        await asyncio.sleep(0.5)

# Usage
async def main():
    await use_async_context_manager()

asyncio.run(main())
```

## Performance Best Practices

### Optimization Checklist
```python
def performance_checklist():
    """Performance optimization checklist"""
    
    checklist = {
        "Use appropriate data structures": {
            "Lists": "For ordered collections, indexing",
            "Sets": "For membership testing, unique items",
            "Dictionaries": "For key-value lookups",
            "Tuples": "For immutable sequences"
        },
        
        "Avoid common performance pitfalls": {
            "String concatenation": "Use join() instead of + in loops",
            "List comprehensions": "Prefer over for loops when possible",
            "Generator expressions": "Use for memory efficiency",
            "Local variables": "Access local variables faster than global"
        },
        
        "Use built-in functions": {
            "sum()": "Faster than manual loops",
            "map()": "For applying functions to iterables",
            "filter()": "For filtering iterables",
            "any()/all()": "For boolean operations"
        },
        
        "Profile before optimizing": {
            "cProfile": "For function-level profiling",
            "line_profiler": "For line-by-line profiling",
            "memory_profiler": "For memory usage analysis",
            "timeit": "For timing comparisons"
        }
    }
    
    return checklist

# Usage
checklist = performance_checklist()
for category, items in checklist.items():
    print(f"\n{category}:")
    for item, description in items.items():
        print(f"  - {item}: {description}")
```

### Performance Monitoring
```python
import time
import functools
import logging

def performance_monitor(func):
    """Decorator to monitor function performance"""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        start_memory = 0  # Could use tracemalloc here
        
        try:
            result = func(*args, **kwargs)
            return result
        finally:
            end_time = time.time()
            execution_time = end_time - start_time
            
            logger = logging.getLogger(__name__)
            logger.info(f"{func.__name__} took {execution_time:.4f} seconds")
    
    return wrapper

@performance_monitor
def monitored_function():
    time.sleep(1)
    return "Done"

# Usage
monitored_function()
```

---

[Previous Chapter](09-debugging.md) | [Next Chapter](11-bestpractices.md)
