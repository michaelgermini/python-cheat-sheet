# Concurrency & Async Programming (Threading, Multiprocessing, Async/Await)

## Threading

### Basic Threading
```python
import threading  # Import threading module for thread management and synchronization
import time       # Import time module for sleep operations and timing
from concurrent.futures import ThreadPoolExecutor  # Import thread pool executor for managed threading

def worker_function(name: str, delay: float):
    """Simple worker function for threading examples that simulates work with delays."""
    print(f"Worker {name} starting")  # Print start message for worker identification
    time.sleep(delay)                 # Simulate work by sleeping for specified duration (I/O bound operation)
    print(f"Worker {name} finished")  # Print completion message

# Creating and starting threads: demonstrate basic threading concepts
def basic_threading():
    # Method 1: Using Thread class directly for explicit thread management
    thread1 = threading.Thread(target=worker_function, args=("A", 2))  # Create thread A with 2-second delay
    thread2 = threading.Thread(target=worker_function, args=("B", 1))  # Create thread B with 1-second delay
    
    thread1.start()  # Start thread A (non-blocking - continues immediately to next line)
    thread2.start()  # Start thread B (non-blocking - continues immediately to next line)
    
    # Wait for threads to complete: ensure all threads finish before proceeding
    thread1.join()   # Block until thread A completes (synchronization point)
    thread2.join()   # Block until thread B completes (synchronization point)
    
    print("All threads completed")  # Print completion message after all threads finish

# Usage: demonstrate basic threading execution
basic_threading()  # Execute the threading example
```

### ThreadPoolExecutor
```python
def thread_pool_example():
    """Using ThreadPoolExecutor for managing threads with automatic resource management."""
    
    def square_number(x: int) -> int:
        time.sleep(0.1)  # Simulate computational work with delay (I/O bound operation)
        return x ** 2    # Return the square of the input number (CPU bound operation)
    
    numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]  # List of numbers to process in parallel
    
    # Using ThreadPoolExecutor: managed thread pool with automatic cleanup
    with ThreadPoolExecutor(max_workers=4) as executor:  # Create thread pool with 4 worker threads (context manager)
        # Submit tasks: create futures for all numbers to be processed
        future_to_number = {executor.submit(square_number, num): num for num in numbers}  # Submit all tasks and track them
        
        # Collect results: process completed futures and gather results
        results = {}  # Dictionary to store number -> result mapping
        for future in future_to_number:  # Iterate over all submitted futures (as they complete)
            number = future_to_number[future]  # Get the original number for this future
            try:
                result = future.result()  # Get the result (blocks until task completes)
                results[number] = result  # Store result in results dictionary
            except Exception as e:  # Handle any exceptions that occurred during processing
                print(f"Error processing {number}: {e}")  # Print error message for debugging
    
    print(f"Results: {results}")  # Print all collected results

# Usage: demonstrate thread pool execution
thread_pool_example()  # Execute the thread pool example
```

### Thread Synchronization
```python
import threading  # Import threading module for locks and synchronization
import time       # Import time module for sleep operations

class BankAccount:
    """Thread-safe bank account with locks to prevent race conditions."""
    
    def __init__(self, initial_balance: float = 0):
        self.balance = initial_balance  # Account balance (shared resource)
        self.lock = threading.Lock()    # Thread lock for synchronization
    
    def deposit(self, amount: float):
        """Thread-safe deposit operation using lock."""
        with self.lock:  # Acquire lock (blocks other threads until released)
            print(f"Depositing {amount}")  # Log the deposit operation
            time.sleep(0.1)  # Simulate processing time (database operation)
            self.balance += amount  # Update balance (critical section)
            print(f"New balance: {self.balance}")  # Log the new balance
    
    def withdraw(self, amount: float) -> bool:
        """Thread-safe withdrawal operation using lock."""
        with self.lock:  # Acquire lock (blocks other threads until released)
            if self.balance >= amount:  # Check if sufficient funds available
                print(f"Withdrawing {amount}")  # Log the withdrawal operation
                time.sleep(0.1)  # Simulate processing time (database operation)
                self.balance -= amount  # Update balance (critical section)
                print(f"New balance: {self.balance}")  # Log the new balance
                return True  # Withdrawal successful
            else:
                print(f"Insufficient funds for withdrawal of {amount}")  # Log insufficient funds
                return False  # Withdrawal failed
    
    def get_balance(self) -> float:
        """Thread-safe balance check operation using lock."""
        with self.lock:  # Acquire lock (blocks other threads until released)
            return self.balance  # Return current balance (critical section)

def account_operations():
    """Demonstrate thread-safe account operations with concurrent access."""
    account = BankAccount(1000)  # Create account with initial balance
    
    def deposit_worker():  # Worker function for deposit operations
        for _ in range(3):  # Perform 3 deposit operations
            account.deposit(100)  # Deposit $100 each time
    
    def withdraw_worker():  # Worker function for withdrawal operations
        for _ in range(3):  # Perform 3 withdrawal operations
            account.withdraw(50)  # Withdraw $50 each time
    
    # Create threads for concurrent operations
    deposit_thread = threading.Thread(target=deposit_worker)  # Thread for deposits
    withdraw_thread = threading.Thread(target=withdraw_worker)  # Thread for withdrawals
    
    # Start threads (non-blocking)
    deposit_thread.start()  # Start deposit thread
    withdraw_thread.start()  # Start withdrawal thread
    
    # Wait for completion (synchronization)
    deposit_thread.join()  # Wait for deposit thread to finish
    withdraw_thread.join()  # Wait for withdrawal thread to finish
    
    print(f"Final balance: {account.get_balance()}")  # Print final balance

# Usage
account_operations()  # Execute the account operations example
```

### Thread Communication with Queues
```python
import queue      # Import queue module for thread-safe queues
import threading  # Import threading module for thread management
import time       # Import time module for sleep operations

def producer_consumer_example():
    """Producer-consumer pattern using queues for thread communication."""
    
    # Thread-safe queues for inter-thread communication
    task_queue = queue.Queue(maxsize=5)   # Queue for tasks (bounded size to prevent memory issues)
    result_queue = queue.Queue()          # Queue for results (unbounded)
    
    def producer():
        """Producer thread that adds tasks to queue."""
        for i in range(10):  # Generate 10 tasks
            task = f"Task {i}"  # Create task string
            task_queue.put(task)  # Add task to queue (blocks if queue is full)
            print(f"Produced: {task}")  # Log the produced task
            time.sleep(0.1)  # Simulate task generation time
        
        # Signal completion to consumer threads
        task_queue.put(None)  # Sentinel value to indicate end of tasks
    
    def consumer():
        """Consumer thread that processes tasks from queue."""
        while True:  # Loop until sentinel value is received
            task = task_queue.get()  # Get task from queue (blocks if queue is empty)
            if task is None:  # Check for sentinel value
                break  # Exit loop when sentinel is received
            
            print(f"Processing: {task}")  # Log the processing
            time.sleep(0.2)  # Simulate processing time
            result = f"Result of {task}"  # Create result string
            result_queue.put(result)  # Add result to result queue
            print(f"Completed: {result}")  # Log the completion
            
            task_queue.task_done()  # Mark task as done (for queue.join())
    
    # Create and start threads for producer-consumer pattern
    producer_thread = threading.Thread(target=producer)  # Thread for producing tasks
    consumer_thread = threading.Thread(target=consumer)  # Thread for consuming tasks
    
    producer_thread.start()  # Start producer thread
    consumer_thread.start()  # Start consumer thread
    
    # Wait for completion (synchronization)
    producer_thread.join()  # Wait for producer to finish
    consumer_thread.join()  # Wait for consumer to finish
    
    # Collect results from result queue
    results = []  # List to store all results
    while not result_queue.empty():  # Process all results in queue
        results.append(result_queue.get())  # Get and add result to list
    
    print(f"All results: {results}")  # Print all collected results

# Usage
producer_consumer_example()  # Execute the producer-consumer example
```

## Multiprocessing

### Basic Multiprocessing
```python
import multiprocessing  # Import multiprocessing module for process management
import time            # Import time module for sleep operations
from concurrent.futures import ProcessPoolExecutor  # Import process pool executor for managed multiprocessing

def cpu_intensive_task(n: int) -> int:
    """CPU-intensive task for multiprocessing examples."""
    result = 0  # Initialize result variable
    for i in range(n):  # Loop through range for CPU-intensive computation
        result += i ** 2  # Add square of each number to result
    return result  # Return computed result

def basic_multiprocessing():
    """Basic multiprocessing example with separate processes."""
    
    def worker_function(name: str, delay: float):
        print(f"Process {name} starting (PID: {multiprocessing.current_process().pid})")  # Log process start with PID
        time.sleep(delay)  # Simulate work with sleep (I/O bound operation)
        print(f"Process {name} finished")  # Log process completion
    
    # Create separate processes for parallel execution
    process1 = multiprocessing.Process(target=worker_function, args=("A", 2))  # Process A with 2-second delay
    process2 = multiprocessing.Process(target=worker_function, args=("B", 1))  # Process B with 1-second delay
    
    # Start processes (non-blocking)
    process1.start()  # Start process A
    process2.start()  # Start process B
    
    # Wait for completion (synchronization)
    process1.join()  # Wait for process A to finish
    process2.join()  # Wait for process B to finish
    
    print("All processes completed")  # Log completion of all processes

# Usage
if __name__ == "__main__":  # Guard for multiprocessing (prevents infinite recursion on Windows)
    basic_multiprocessing()  # Execute the multiprocessing example
```

### ProcessPoolExecutor
```python
def process_pool_example():
    """Using ProcessPoolExecutor for CPU-intensive tasks."""
    
    numbers = [1000000, 2000000, 3000000, 4000000, 5000000]
    
    # Using ProcessPoolExecutor
    with ProcessPoolExecutor(max_workers=multiprocessing.cpu_count()) as executor:
        # Submit tasks
        future_to_number = {executor.submit(cpu_intensive_task, num): num for num in numbers}
        
        # Collect results
        results = {}
        for future in future_to_number:
            number = future_to_number[future]
            try:
                result = future.result()
                results[number] = result
                print(f"Completed calculation for {number}: {result}")
            except Exception as e:
                print(f"Error processing {number}: {e}")
    
    print(f"All results: {results}")

# Usage
if __name__ == "__main__":
    process_pool_example()
```

### Shared Memory and Locks
```python
import multiprocessing as mp
import time

def shared_memory_example():
    """Example of shared memory between processes."""
    
    # Shared value
    shared_value = mp.Value('i', 0)
    shared_lock = mp.Lock()
    
    def increment_worker(name: str, iterations: int):
        """Worker that increments shared value."""
        for i in range(iterations):
            with shared_lock:
                current = shared_value.value
                time.sleep(0.001)  # Simulate work
                shared_value.value = current + 1
                print(f"Process {name}: Incremented to {shared_value.value}")
    
    # Create processes
    process1 = mp.Process(target=increment_worker, args=("A", 5))
    process2 = mp.Process(target=increment_worker, args=("B", 5))
    
    # Start processes
    process1.start()
    process2.start()
    
    # Wait for completion
    process1.join()
    process2.join()
    
    print(f"Final shared value: {shared_value.value}")

# Usage
if __name__ == "__main__":
    shared_memory_example()
```

## Async Programming with asyncio

### Basic Async/Await
```python
import asyncio
import time

async def async_worker(name: str, delay: float):
    """Async worker function."""
    print(f"Async worker {name} starting")
    await asyncio.sleep(delay)  # Non-blocking sleep
    print(f"Async worker {name} finished")
    return f"Result from {name}"

async def basic_async_example():
    """Basic async/await example."""
    
    # Run single async function
    result = await async_worker("A", 2)
    print(f"Single result: {result}")
    
    # Run multiple async functions concurrently
    tasks = [
        async_worker("B", 1),
        async_worker("C", 1.5),
        async_worker("D", 0.5)
    ]
    
    results = await asyncio.gather(*tasks)
    print(f"All results: {results}")

# Usage
asyncio.run(basic_async_example())
```

### Async with aiohttp
```python
import aiohttp
import asyncio
import time

async def fetch_url(session: aiohttp.ClientSession, url: str) -> str:
    """Fetch a single URL asynchronously."""
    async with session.get(url) as response:
        return await response.text()

async def fetch_multiple_urls(urls: list) -> list:
    """Fetch multiple URLs concurrently."""
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_url(session, url) for url in urls]
        results = await asyncio.gather(*tasks)
        return results

async def http_example():
    """Example of async HTTP requests."""
    urls = [
        'https://httpbin.org/delay/1',
        'https://httpbin.org/delay/1',
        'https://httpbin.org/delay/1'
    ]
    
    start_time = time.time()
    results = await fetch_multiple_urls(urls)
    end_time = time.time()
    
    print(f"Fetched {len(results)} URLs in {end_time - start_time:.2f} seconds")
    return results

# Usage
# asyncio.run(http_example())
```

### Async Context Managers
```python
import asyncio
import aiofiles

async def async_file_operations():
    """Example of async file operations."""
    
    # Async file reading
    async with aiofiles.open('example.txt', 'r') as f:
        content = await f.read()
    
    # Async file writing
    async with aiofiles.open('output.txt', 'w') as f:
        await f.write(content.upper())
    
    return content

class AsyncResource:
    """Custom async context manager."""
    
    async def __aenter__(self):
        print("Acquiring async resource")
        await asyncio.sleep(0.1)  # Simulate async setup
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        print("Releasing async resource")
        await asyncio.sleep(0.1)  # Simulate async cleanup

async def use_async_context_manager():
    """Using custom async context manager."""
    async with AsyncResource() as resource:
        print("Using async resource")
        await asyncio.sleep(0.5)

# Usage
async def main():
    await use_async_context_manager()

# asyncio.run(main())
```

### Async Queues and Producers/Consumers
```python
import asyncio
import random

async def async_producer_consumer():
    """Async producer-consumer pattern."""
    
    queue = asyncio.Queue(maxsize=5)
    
    async def producer():
        """Async producer."""
        for i in range(10):
            item = f"Item {i}"
            await queue.put(item)
            print(f"Produced: {item}")
            await asyncio.sleep(random.uniform(0.1, 0.3))
        
        # Signal completion
        await queue.put(None)
    
    async def consumer():
        """Async consumer."""
        while True:
            item = await queue.get()
            if item is None:
                break
            
            print(f"Processing: {item}")
            await asyncio.sleep(random.uniform(0.2, 0.4))
            print(f"Completed: {item}")
            
            queue.task_done()
    
    # Create tasks
    producer_task = asyncio.create_task(producer())
    consumer_task = asyncio.create_task(consumer())
    
    # Wait for completion
    await producer_task
    await consumer_task
    
    print("All async tasks completed")

# Usage
# asyncio.run(async_producer_consumer())
```

## Concurrency Patterns

### Threading vs Multiprocessing vs Async
```python
import threading
import multiprocessing
import asyncio
import time

def cpu_bound_task(n: int) -> int:
    """CPU-bound task."""
    result = 0
    for i in range(n):
        result += i ** 2
    return result

async def io_bound_task(delay: float) -> str:
    """I/O-bound task."""
    await asyncio.sleep(delay)
    return f"Completed after {delay}s"

def compare_concurrency_methods():
    """Compare different concurrency methods."""
    
    # Threading (good for I/O-bound tasks)
    def threading_example():
        start_time = time.time()
        
        def worker():
            time.sleep(1)  # Simulate I/O
        
        threads = [threading.Thread(target=worker) for _ in range(5)]
        for thread in threads:
            thread.start()
        for thread in threads:
            thread.join()
        
        end_time = time.time()
        print(f"Threading took: {end_time - start_time:.2f}s")
    
    # Multiprocessing (good for CPU-bound tasks)
    def multiprocessing_example():
        start_time = time.time()
        
        with multiprocessing.Pool() as pool:
            results = pool.map(cpu_bound_task, [100000] * 5)
        
        end_time = time.time()
        print(f"Multiprocessing took: {end_time - start_time:.2f}s")
    
    # Async (excellent for I/O-bound tasks)
    async def async_example():
        start_time = time.time()
        
        tasks = [io_bound_task(1) for _ in range(5)]
        await asyncio.gather(*tasks)
        
        end_time = time.time()
        print(f"Async took: {end_time - start_time:.2f}s")
    
    print("Comparing concurrency methods:")
    threading_example()
    multiprocessing_example()
    asyncio.run(async_example())

# Usage
if __name__ == "__main__":
    compare_concurrency_methods()
```

### GIL (Global Interpreter Lock) Understanding
```python
import threading
import time

def gil_example():
    """Demonstrate GIL impact on CPU-bound tasks."""
    
    def cpu_intensive():
        """CPU-intensive task that will be affected by GIL."""
        start = time.time()
        result = 0
        for i in range(10000000):
            result += i
        end = time.time()
        print(f"CPU task completed in {end - start:.2f}s")
        return result
    
    # Single-threaded execution
    print("Single-threaded execution:")
    start_time = time.time()
    cpu_intensive()
    cpu_intensive()
    end_time = time.time()
    print(f"Total time: {end_time - start_time:.2f}s\n")
    
    # Multi-threaded execution (GIL will serialize execution)
    print("Multi-threaded execution (affected by GIL):")
    start_time = time.time()
    
    thread1 = threading.Thread(target=cpu_intensive)
    thread2 = threading.Thread(target=cpu_intensive)
    
    thread1.start()
    thread2.start()
    
    thread1.join()
    thread2.join()
    
    end_time = time.time()
    print(f"Total time: {end_time - start_time:.2f}s")

# Usage
gil_example()
```

### Async Event Loop and Tasks
```python
import asyncio
import time

async def task_with_cancellation():
    """Example of task cancellation."""
    
    async def long_running_task():
        try:
            await asyncio.sleep(10)
            print("Long task completed")
        except asyncio.CancelledError:
            print("Long task was cancelled")
            raise
    
    # Create task
    task = asyncio.create_task(long_running_task())
    
    # Let it run for a bit
    await asyncio.sleep(1)
    
    # Cancel the task
    task.cancel()
    
    try:
        await task
    except asyncio.CancelledError:
        print("Task was cancelled as expected")

async def task_with_timeout():
    """Example of task timeout."""
    
    async def slow_operation():
        await asyncio.sleep(5)
        return "Operation completed"
    
    try:
        # Run with timeout
        result = await asyncio.wait_for(slow_operation(), timeout=2.0)
        print(result)
    except asyncio.TimeoutError:
        print("Operation timed out")

async def concurrent_tasks():
    """Example of managing multiple concurrent tasks."""
    
    async def worker(name: str, delay: float):
        print(f"Worker {name} starting")
        await asyncio.sleep(delay)
        print(f"Worker {name} completed")
        return f"Result from {name}"
    
    # Create multiple tasks
    tasks = [
        asyncio.create_task(worker("A", 2)),
        asyncio.create_task(worker("B", 1)),
        asyncio.create_task(worker("C", 3))
    ]
    
    # Wait for first task to complete
    done, pending = await asyncio.wait(tasks, return_when=asyncio.FIRST_COMPLETED)
    
    print(f"First completed: {done}")
    print(f"Still pending: {pending}")
    
    # Cancel remaining tasks
    for task in pending:
        task.cancel()
    
    # Wait for cancellation
    await asyncio.gather(*pending, return_exceptions=True)

# Usage
async def main():
    print("Task cancellation example:")
    await task_with_cancellation()
    
    print("\nTask timeout example:")
    await task_with_timeout()
    
    print("\nConcurrent tasks example:")
    await concurrent_tasks()

# asyncio.run(main())
```

## Best Practices and Common Pitfalls

### Thread Safety
```python
import threading
import time

class ThreadSafeCounter:
    """Thread-safe counter implementation."""
    
    def __init__(self):
        self._value = 0
        self._lock = threading.Lock()
    
    def increment(self):
        """Thread-safe increment."""
        with self._lock:
            current = self._value
            time.sleep(0.001)  # Simulate work
            self._value = current + 1
    
    def get_value(self):
        """Thread-safe value retrieval."""
        with self._lock:
            return self._value

def thread_safety_example():
    """Demonstrate thread safety."""
    counter = ThreadSafeCounter()
    
    def increment_worker():
        for _ in range(1000):
            counter.increment()
    
    # Create multiple threads
    threads = [threading.Thread(target=increment_worker) for _ in range(5)]
    
    # Start all threads
    for thread in threads:
        thread.start()
    
    # Wait for completion
    for thread in threads:
        thread.join()
    
    print(f"Final counter value: {counter.get_value()}")

# Usage
thread_safety_example()
```

### Async Best Practices
```python
import asyncio
import aiohttp

async def async_best_practices():
    """Demonstrate async best practices."""
    
    # Good: Use asyncio.gather for concurrent tasks
    async def fetch_data_concurrent(urls):
        async with aiohttp.ClientSession() as session:
            tasks = [fetch_url(session, url) for url in urls]
            return await asyncio.gather(*tasks)
    
    # Bad: Sequential execution
    async def fetch_data_sequential(urls):
        async with aiohttp.ClientSession() as session:
            results = []
            for url in urls:
                result = await fetch_url(session, url)
                results.append(result)
            return results
    
    # Good: Use asyncio.create_task for fire-and-forget
    async def background_task():
        await asyncio.sleep(5)
        print("Background task completed")
    
    # Start background task
    task = asyncio.create_task(background_task())
    
    # Do other work
    print("Main work continues...")
    
    # Wait for background task if needed
    await task
    
    print("All work completed")

# Usage
# asyncio.run(async_best_practices())
```

---

[Previous Chapter](12-advanced.md) | [Next Chapter](14-datascience.md)
