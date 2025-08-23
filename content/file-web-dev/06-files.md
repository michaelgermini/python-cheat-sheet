# File Handling (Text, CSV, JSON)

## Text Files

### Reading Text Files
```python
# Basic file reading: read entire file content into a single string
with open('file.txt', 'r', encoding='utf-8') as f:  # Open file in read mode with UTF-8 encoding
    content = f.read()  # Read entire file content as a single string

# Reading line by line: process file efficiently without loading entire content into memory
with open('file.txt', 'r', encoding='utf-8') as f:  # Open file in read mode with UTF-8 encoding
    for line in f:  # Iterate over file lines (memory efficient for large files)
        print(line.strip())  # Print each line with whitespace removed

# Reading all lines into a list: load all lines into memory for random access
with open('file.txt', 'r', encoding='utf-8') as f:  # Open file in read mode with UTF-8 encoding
    lines = f.readlines()  # Read all lines into a list (each line as a separate element)
```

### Writing Text Files
```python
# Writing text: write a single string to a file
with open('output.txt', 'w', encoding='utf-8') as f:  # Open file in write mode (overwrites existing content)
    f.write("Hello, World!")  # Write string content to file

# Writing multiple lines: write multiple lines efficiently using a generator expression
lines = ["Line 1", "Line 2", "Line 3"]  # List of strings to write
with open('output.txt', 'w', encoding='utf-8') as f:  # Open file in write mode
    f.writelines(line + '\n' for line in lines)  # Write each line with newline character

# Appending to file: add content to existing file without overwriting
with open('output.txt', 'a', encoding='utf-8') as f:  # Open file in append mode (preserves existing content)
    f.write("\nNew line")  # Add new line to end of file
```

### File Modes
```python
# Common file modes: specify how to open and interact with files
'r'     # Read mode (default): open file for reading only
'w'     # Write mode: create new file or overwrite existing file
'a'     # Append mode: add content to end of existing file (creates file if it doesn't exist)
'r+'    # Read and write mode: open file for both reading and writing
'w+'    # Write and read mode: create new file or overwrite existing file, then allow reading
'a+'    # Append and read mode: add content to end of file and allow reading
'b'     # Binary mode: handle file as binary data (e.g., 'rb', 'wb', 'ab')
```

## CSV Files

### Reading CSV
```python
import csv  # Import CSV module for handling comma-separated values

# Basic CSV reading: read CSV file as list of lists (rows as lists)
with open('data.csv', 'r', newline='', encoding='utf-8') as f:  # Open CSV file with proper line ending handling
    reader = csv.reader(f)  # Create CSV reader object
    for row in reader:  # Iterate over each row in the CSV file
        print(row)  # Print each row as a list of values

# Reading with DictReader: read CSV file as list of dictionaries (rows as dicts with column headers as keys)
with open('data.csv', 'r', newline='', encoding='utf-8') as f:  # Open CSV file with proper line ending handling
    reader = csv.DictReader(f)  # Create CSV reader that uses first row as column headers
    for row in reader:  # Iterate over each row in the CSV file
        print(row['name'], row['age'])  # Access values by column name (more readable)

# Reading with pandas: powerful data analysis library for CSV handling
import pandas as pd  # Import pandas for advanced data manipulation
df = pd.read_csv('data.csv')  # Read CSV into pandas DataFrame (handles many edge cases automatically)
```

### Writing CSV
```python
import csv  # Import CSV module for handling comma-separated values

# Basic CSV writing: write list of lists to CSV file
data = [['Name', 'Age', 'City'], ['Alice', 30, 'NYC'], ['Bob', 25, 'LA']]  # Data as list of lists
with open('output.csv', 'w', newline='', encoding='utf-8') as f:  # Open file for writing with proper line ending handling
    writer = csv.writer(f)  # Create CSV writer object
    writer.writerows(data)  # Write all rows at once (more efficient than writing one by one)

# Writing with DictWriter: write list of dictionaries to CSV file with column headers
data = [
    {'name': 'Alice', 'age': 30, 'city': 'NYC'},  # Data as list of dictionaries
    {'name': 'Bob', 'age': 25, 'city': 'LA'}
]
with open('output.csv', 'w', newline='', encoding='utf-8') as f:  # Open file for writing
    fieldnames = ['name', 'age', 'city']  # Define column order and names
    writer = csv.DictWriter(f, fieldnames=fieldnames)  # Create DictWriter with specified field names
    writer.writeheader()  # Write column headers as first row
    writer.writerows(data)  # Write all data rows

# Writing with pandas: write DataFrame to CSV file
df.to_csv('output.csv', index=False)  # Write DataFrame to CSV, exclude row index numbers
```

### CSV Best Practices
```python
import csv

# Handling different delimiters
with open('data.csv', 'r', newline='', encoding='utf-8') as f:
    reader = csv.reader(f, delimiter=';')  # For semicolon-separated files

# Handling quotes
with open('data.csv', 'r', newline='', encoding='utf-8') as f:
    reader = csv.reader(f, quoting=csv.QUOTE_ALL)  # Quote all fields

# Error handling
try:
    with open('data.csv', 'r', newline='', encoding='utf-8') as f:
        reader = csv.reader(f)
        for row_num, row in enumerate(reader, 1):
            try:
                # Process row
                pass
            except Exception as e:
                print(f"Error in row {row_num}: {e}")
except FileNotFoundError:
    print("File not found")
```

## JSON Files

### Reading JSON
```python
import json  # Import JSON module for handling JavaScript Object Notation

# Reading JSON file: load JSON data from file into Python objects
with open('data.json', 'r', encoding='utf-8') as f:  # Open JSON file in read mode
    data = json.load(f)  # Parse JSON content into Python dictionary/list

# Reading JSON string: parse JSON string into Python objects
json_string = '{"name": "Alice", "age": 30}'  # JSON string (note: double quotes required)
data = json.loads(json_string)  # Parse JSON string into Python dictionary

# Reading with error handling: robust JSON parsing with exception handling
try:
    with open('data.json', 'r', encoding='utf-8') as f:  # Open JSON file
        data = json.load(f)  # Parse JSON content
except json.JSONDecodeError as e:  # Handle malformed JSON syntax
    print(f"Invalid JSON: {e}")  # Print specific JSON parsing error
except FileNotFoundError:  # Handle missing file
    print("File not found")  # User-friendly error message
```

### Writing JSON
```python
import json  # Import JSON module for handling JavaScript Object Notation

# Writing JSON file: serialize Python objects to JSON file
data = {
    'name': 'Alice',
    'age': 30,
    'city': 'NYC',
    'hobbies': ['reading', 'swimming']  # Nested data structures supported
}

with open('output.json', 'w', encoding='utf-8') as f:  # Open file for writing
    json.dump(data, f, indent=2, ensure_ascii=False)  # Write JSON with pretty formatting and Unicode support

# Writing JSON string: serialize Python objects to JSON string
json_string = json.dumps(data, indent=2, ensure_ascii=False)  # Convert to JSON string instead of writing to file

# Writing with custom serialization: handle non-JSON-serializable objects
class Person:
    def __init__(self, name, age):
        self.name = name  # Person object attributes
        self.age = age

def person_encoder(obj):  # Custom encoder function for Person objects
    if isinstance(obj, Person):  # Check if object is Person instance
        return {'name': obj.name, 'age': obj.age}  # Convert to dictionary format
    raise TypeError(f"Object of type {type(obj)} is not JSON serializable")  # Raise error for unsupported types

person = Person('Alice', 30)  # Create Person object
with open('output.json', 'w', encoding='utf-8') as f:  # Open file for writing
    json.dump(person, f, default=person_encoder, indent=2)  # Use custom encoder for serialization
```

### JSON Best Practices
```python
import json

# Pretty printing
data = {'name': 'Alice', 'age': 30}
json_string = json.dumps(data, indent=2, sort_keys=True)

# Handling datetime objects
from datetime import datetime

def datetime_encoder(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"Object of type {type(obj)} is not JSON serializable")

data = {'timestamp': datetime.now()}
json_string = json.dumps(data, default=datetime_encoder)
```

## Other File Formats

### Excel Files
```python
import pandas as pd

# Reading Excel
df = pd.read_excel('data.xlsx', sheet_name='Sheet1')

# Writing Excel
df.to_excel('output.xlsx', sheet_name='Sheet1', index=False)

# Reading multiple sheets
excel_file = pd.ExcelFile('data.xlsx')
sheet_names = excel_file.sheet_names
for sheet in sheet_names:
    df = pd.read_excel('data.xlsx', sheet_name=sheet)
```

### Pickle Files
```python
import pickle

# Writing pickle
data = {'name': 'Alice', 'age': 30}
with open('data.pkl', 'wb') as f:
    pickle.dump(data, f)

# Reading pickle
with open('data.pkl', 'rb') as f:
    data = pickle.load(f)

# Security warning: Only load pickle files from trusted sources
```

### YAML Files
```python
import yaml

# Reading YAML
with open('config.yaml', 'r', encoding='utf-8') as f:
    config = yaml.safe_load(f)

# Writing YAML
config = {
    'database': {
        'host': 'localhost',
        'port': 5432
    },
    'api': {
        'timeout': 30
    }
}

with open('config.yaml', 'w', encoding='utf-8') as f:
    yaml.dump(config, f, default_flow_style=False)
```

## File System Operations

### Path Operations
```python
from pathlib import Path

# Creating paths
file_path = Path('folder/subfolder/file.txt')
file_path.parent.mkdir(parents=True, exist_ok=True)

# Checking file existence
if file_path.exists():
    print("File exists")

# Getting file info
print(file_path.name)      # file.txt
print(file_path.suffix)    # .txt
print(file_path.stem)      # file
print(file_path.parent)    # folder/subfolder
```

### Directory Operations
```python
import os
from pathlib import Path

# Listing directory contents
for item in Path('.').iterdir():
    print(item)

# Walking directory tree
for root, dirs, files in os.walk('.'):
    for file in files:
        if file.endswith('.py'):
            print(os.path.join(root, file))

# Creating directories
Path('new_folder').mkdir(exist_ok=True)
Path('nested/folders').mkdir(parents=True, exist_ok=True)
```

### File Operations
```python
import shutil
from pathlib import Path

# Copying files
shutil.copy('source.txt', 'destination.txt')
shutil.copy2('source.txt', 'destination.txt')  # Preserves metadata

# Moving files
shutil.move('old_name.txt', 'new_name.txt')

# Removing files
Path('file_to_delete.txt').unlink()

# Removing directories
shutil.rmtree('directory_to_remove')
```

## Error Handling and Best Practices

### Robust File Operations
```python
from pathlib import Path
import logging

def safe_read_file(file_path):
    """Safely read a file with proper error handling."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        logging.error(f"File not found: {file_path}")
        return None
    except PermissionError:
        logging.error(f"Permission denied: {file_path}")
        return None
    except UnicodeDecodeError:
        logging.error(f"Encoding error: {file_path}")
        return None

def safe_write_file(file_path, content):
    """Safely write content to a file."""
    try:
        # Create parent directories if they don't exist
        Path(file_path).parent.mkdir(parents=True, exist_ok=True)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    except Exception as e:
        logging.error(f"Error writing file {file_path}: {e}")
        return False
```

### Context Managers
```python
class FileManager:
    def __init__(self, filename, mode='r', encoding='utf-8'):
        self.filename = filename
        self.mode = mode
        self.encoding = encoding
        self.file = None

    def __enter__(self):
        self.file = open(self.filename, self.mode, encoding=self.encoding)
        return self.file

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.file:
            self.file.close()

# Usage
with FileManager('data.txt', 'w') as f:
    f.write('Hello, World!')
```

---

[Previous Chapter](05-libraries.md) | [Next Chapter](07-web.md)
