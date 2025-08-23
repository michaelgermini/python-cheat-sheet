# Popular Libraries (NumPy, Pandas, Matplotlib)

## NumPy

### Installation
```bash
pip install numpy
```

### Basic Operations
```python
import numpy as np  # Import NumPy with alias 'np' (convention)

# Creating different types of arrays: various methods to initialize NumPy arrays
arr1 = np.array([1, 2, 3, 4, 5])           # Create array from Python list (most common method)
arr2 = np.zeros(5)                          # Create array of 5 zeros: [0., 0., 0., 0., 0.] (float type)
arr3 = np.ones(3)                           # Create array of 3 ones: [1., 1., 1.] (float type)
arr4 = np.arange(0, 10, 2)                  # Create array with step: [0, 2, 4, 6, 8] (like range() but returns array)
arr5 = np.linspace(0, 1, 5)                 # Create 5 evenly spaced values: [0., 0.25, 0.5, 0.75, 1.] (inclusive endpoints)

# Vectorized operations: apply operations to entire arrays at once (much faster than loops)
print(arr1 + 2)      # Element-wise addition: [3, 4, 5, 6, 7] (adds 2 to each element)
print(arr1 * 2)      # Element-wise multiplication: [2, 4, 6, 8, 10] (multiplies each element by 2)
print(arr1 ** 2)     # Element-wise exponentiation: [1, 4, 9, 16, 25] (squares each element)
```

### Multi-dimensional Arrays
```python
# Multi-dimensional arrays: working with 2D and 3D data structures
matrix = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])  # Create 2D array (3x3 matrix) from nested lists
print(matrix.shape)  # Output: (3, 3) - shows dimensions (rows, columns) as tuple

# Creating special matrices for different purposes: common matrix initialization patterns
zeros_matrix = np.zeros((3, 3))    # 3x3 matrix filled with zeros (useful for initialization)
identity_matrix = np.eye(3)        # 3x3 identity matrix (1s on diagonal, 0s elsewhere) - useful for linear algebra
random_matrix = np.random.rand(3, 3)  # 3x3 matrix with random values between 0 and 1 (uniform distribution)

# Indexing and slicing multi-dimensional arrays: accessing specific elements and subarrays
print(matrix[0, 1])      # Access element at row 0, column 1: 2 (zero-based indexing)
print(matrix[0, :])      # Get entire first row: [1, 2, 3] (colon means "all columns")
print(matrix[:, 1])      # Get entire second column: [2, 5, 8] (colon means "all rows")
```

### Mathematical Operations
```python
arr = np.array([1, 2, 3, 4, 5])  # Sample array for statistical operations

# Basic statistical operations on arrays: common mathematical functions
print(np.mean(arr))      # Calculate arithmetic mean: 3.0 (sum of all elements divided by count)
print(np.std(arr))       # Calculate standard deviation: 1.414... (measure of data spread)
print(np.sum(arr))       # Calculate sum of all elements: 15 (total of all values)
print(np.max(arr))       # Find maximum value: 5 (highest value in array)
print(np.min(arr))       # Find minimum value: 1 (lowest value in array)

# Matrix operations: working with 2D arrays for linear algebra
A = np.array([[1, 2], [3, 4]])  # First 2x2 matrix for demonstration
B = np.array([[5, 6], [7, 8]])  # Second 2x2 matrix for demonstration

print(A + B)             # Element-wise addition (adds corresponding elements position by position)
print(A * B)             # Element-wise multiplication (multiplies corresponding elements position by position)
print(np.dot(A, B))      # Matrix multiplication (dot product) - proper matrix multiplication
print(A @ B)             # Matrix multiplication using @ operator (Python 3.5+) - same as np.dot()
```

### Broadcasting
```python
# Broadcasting: NumPy's ability to perform operations on arrays of different shapes automatically
arr = np.array([1, 2, 3, 4, 5])                    # 1D array with 5 elements
matrix = np.array([[1, 2, 3], [4, 5, 6]])          # 2D array (2x3 matrix)

print(arr + 10)          # Broadcasting: scalar 10 is added to each element: [11, 12, 13, 14, 15] (scalar expands to match array)
print(matrix * 2)        # Broadcasting: scalar 2 multiplies each element: [[2, 4, 6], [8, 10, 12]] (scalar expands to match matrix)
```

## Pandas

### Installation
```bash
pip install pandas
```

### Series
```python
import pandas as pd  # Import pandas with alias 'pd' (convention)

# Creating different types of Series (1D labeled arrays): various initialization methods
s1 = pd.Series([1, 2, 3, 4, 5])                        # Series with default numeric index (0, 1, 2, 3, 4)
s2 = pd.Series([1, 2, 3, 4, 5], index=['a', 'b', 'c', 'd', 'e'])  # Series with custom string index
s3 = pd.Series({'a': 1, 'b': 2, 'c': 3})               # Series from dictionary (keys become index automatically)

# Statistical operations on Series: built-in methods for data analysis
print(s1.mean())         # Calculate mean: 3.0 (arithmetic average of all values)
print(s1.std())          # Calculate standard deviation: 1.581... (measure of data variability)
print(s1.describe())     # Generate comprehensive summary statistics (count, mean, std, min, 25%, 50%, 75%, max)
```

### DataFrames
```python
# Creating DataFrame from dictionary (most common method): structured data container
data = {
    'Name': ['Alice', 'Bob', 'Charlie', 'Diana'],      # Column 1: names (string data)
    'Age': [25, 30, 35, 28],                           # Column 2: ages (integer data)
    'City': ['NYC', 'LA', 'Chicago', 'Boston'],        # Column 3: cities (string data)
    'Salary': [50000, 60000, 70000, 55000]             # Column 4: salaries (integer data)
}
df = pd.DataFrame(data)  # Create DataFrame from dictionary (keys become column names)

# Basic DataFrame operations and information: essential methods for data exploration
print(df.head())         # Display first 5 rows of DataFrame (quick preview of data)
print(df.info())         # Show DataFrame structure and data types (memory usage and non-null counts)
print(df.describe())     # Generate statistical summary of numeric columns (count, mean, std, min, 25%, 50%, 75%, max)
```

### Reading and Writing Data
```python
# Reading data from different file formats: pandas supports many data sources
df = pd.read_csv('data.csv')      # Read data from CSV file (most common format for tabular data)
df = pd.read_excel('data.xlsx')   # Read data from Excel file (requires openpyxl or xlrd package)
df = pd.read_json('data.json')    # Read data from JSON file (nested data structures)

# Writing data to different file formats: export DataFrames to various formats
df.to_csv('output.csv', index=False)    # Save as CSV (index=False excludes row numbers from output)
df.to_excel('output.xlsx', index=False) # Save as Excel file (requires openpyxl package)
df.to_json('output.json')               # Save as JSON file (preserves data structure)
```

### Data Manipulation
```python
# Data selection and filtering operations: accessing and subsetting data
names = df['Name']                    # Select single column (returns Series object)
subset = df[['Name', 'Age']]          # Select multiple columns (returns DataFrame with specified columns)

# Filtering data based on conditions: boolean indexing for row selection
young_people = df[df['Age'] < 30]     # Filter rows where Age is less than 30 (boolean mask)
high_salary = df[df['Salary'] > 60000] # Filter rows where Salary is greater than 60000 (boolean mask)

# Sorting data: arrange rows based on column values
df_sorted = df.sort_values('Age', ascending=False)  # Sort by Age in descending order (oldest first)

# Grouping and aggregation: split data into groups and apply functions
grouped = df.groupby('City')['Salary'].mean()  # Group by City and calculate mean salary for each city
```

### Handling Missing Data
```python
# Handling missing data (NaN values) in DataFrames: essential for data cleaning
print(df.isnull().sum())  # Count missing values in each column (returns Series with column names and counts)

# Filling missing values with appropriate strategies: different approaches for different scenarios
df['Age'].fillna(df['Age'].mean(), inplace=True)  # Fill missing ages with mean age (inplace=True modifies original DataFrame)
df.dropna(inplace=True)  # Remove rows that contain any missing values (inplace=True modifies original DataFrame)
```

### Merging and Joining
```python
# Creating another DataFrame for demonstration of merging operations: combining data from multiple sources
df2 = pd.DataFrame({
    'Name': ['Alice', 'Bob', 'Eve'],           # Names (some overlap with df for demonstration)
    'Department': ['IT', 'HR', 'Marketing']    # Department information (new data to merge)
})

# Different types of joins between DataFrames: SQL-like operations for combining data
merged = pd.merge(df, df2, on='Name', how='inner')      # Inner join: only rows that exist in both DataFrames
left_merged = pd.merge(df, df2, on='Name', how='left')  # Left join: all rows from left DataFrame (df), matching rows from right DataFrame (df2)
```

## Matplotlib

### Installation
```bash
pip install matplotlib
```

### Basic Plotting
```python
import matplotlib.pyplot as plt  # Import matplotlib for plotting and visualization
import numpy as np               # Import numpy for numerical operations and array generation

# Creating a simple line plot: basic visualization example
x = np.linspace(0, 10, 100)      # Create 100 evenly spaced points from 0 to 10 (x-axis values)
y = np.sin(x)                    # Calculate sine values for each x point (y-axis values)

plt.plot(x, y)                   # Create line plot of x vs y (connects points with lines)
plt.title('Sine Wave')           # Set plot title (appears at top of figure)
plt.xlabel('x')                  # Set x-axis label (horizontal axis description)
plt.ylabel('sin(x)')             # Set y-axis label (vertical axis description)
plt.grid(True)                   # Add grid lines to plot (helps with reading values)
plt.show()                       # Display the plot (opens in new window or notebook cell)
```

### Multiple Plots
```python
# Creating multiple subplots in a single figure: organize multiple plots in one window
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))  # Create 1 row, 2 columns of subplots with specified figure size

# First subplot: sine wave
ax1.plot(x, np.sin(x))           # Plot sine function on first subplot (ax1 is the first subplot object)
ax1.set_title('Sine Wave')       # Set title for first subplot (appears above the plot)
ax1.grid(True)                   # Add grid to first subplot (horizontal and vertical reference lines)

# Second subplot: cosine wave
ax2.plot(x, np.cos(x))           # Plot cosine function on second subplot (ax2 is the second subplot object)
ax2.set_title('Cosine Wave')     # Set title for second subplot (appears above the plot)
ax2.grid(True)                   # Add grid to second subplot (horizontal and vertical reference lines)

plt.tight_layout()               # Automatically adjust spacing between subplots (prevents overlap)
plt.show()                       # Display the figure with both subplots (opens in new window or notebook cell)
```

### Different Plot Types
```python
# Different types of plots for various data visualization needs

# Scatter plot: shows relationship between two variables
x = np.random.randn(100)          # Generate 100 random x values
y = np.random.randn(100)          # Generate 100 random y values
plt.scatter(x, y, alpha=0.6)      # Create scatter plot with transparency
plt.title('Scatter Plot')         # Set plot title
plt.show()                        # Display plot

# Bar plot: shows categorical data
categories = ['A', 'B', 'C', 'D']  # Category labels
values = [4, 3, 2, 1]             # Corresponding values
plt.bar(categories, values)        # Create bar plot
plt.title('Bar Plot')             # Set plot title
plt.show()                        # Display plot

# Histogram: shows distribution of data
data = np.random.randn(1000)      # Generate 1000 random values
plt.hist(data, bins=30, alpha=0.7) # Create histogram with 30 bins and transparency
plt.title('Histogram')            # Set plot title
plt.show()                        # Display plot

# Pie chart: shows proportions of a whole
sizes = [30, 20, 25, 15, 10]      # Values representing proportions
labels = ['A', 'B', 'C', 'D', 'E'] # Labels for each slice
plt.pie(sizes, labels=labels, autopct='%1.1f%%')  # Create pie chart with percentage labels
plt.title('Pie Chart')            # Set plot title
plt.show()                        # Display plot
```

### Plotting with Pandas
```python
# Using pandas DataFrame
df = pd.DataFrame({
    'x': np.linspace(0, 10, 100),
    'y1': np.sin(np.linspace(0, 10, 100)),
    'y2': np.cos(np.linspace(0, 10, 100))
})

# Line plot
df.plot(x='x', y=['y1', 'y2'])
plt.title('Sine and Cosine Waves')
plt.show()

# Scatter plot
df.plot.scatter(x='x', y='y1')
plt.title('Scatter Plot')
plt.show()
```

### Customizing Plots
```python
# Setting style
plt.style.use('seaborn')

# Creating figure with custom size
fig, ax = plt.subplots(figsize=(10, 6))

# Plotting with custom colors and styles
ax.plot(x, np.sin(x), color='blue', linewidth=2, label='sin(x)')
ax.plot(x, np.cos(x), color='red', linewidth=2, linestyle='--', label='cos(x)')

# Customizing appearance
ax.set_title('Trigonometric Functions', fontsize=16, fontweight='bold')
ax.set_xlabel('x', fontsize=12)
ax.set_ylabel('y', fontsize=12)
ax.legend(fontsize=12)
ax.grid(True, alpha=0.3)

# Setting limits
ax.set_xlim(0, 10)
ax.set_ylim(-1.5, 1.5)

plt.tight_layout()
plt.show()
```

### Saving Plots
```python
# Save as PNG
plt.savefig('plot.png', dpi=300, bbox_inches='tight')

# Save as PDF
plt.savefig('plot.pdf', bbox_inches='tight')

# Save as SVG
plt.savefig('plot.svg', bbox_inches='tight')
```

## Integration Example
```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Generate sample data
np.random.seed(42)
data = {
    'x': np.random.randn(1000),
    'y': np.random.randn(1000),
    'category': np.random.choice(['A', 'B', 'C'], 1000)
}
df = pd.DataFrame(data)

# Create visualization
fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 10))

# Scatter plot
ax1.scatter(df['x'], df['y'], alpha=0.6)
ax1.set_title('Scatter Plot')

# Histogram
ax2.hist(df['x'], bins=30, alpha=0.7)
ax2.set_title('Histogram of X')

# Box plot by category
df.boxplot(column='y', by='category', ax=ax3)
ax3.set_title('Box Plot by Category')

# Correlation heatmap
correlation = df[['x', 'y']].corr()
im = ax4.imshow(correlation, cmap='coolwarm', aspect='auto')
ax4.set_xticks([0, 1])
ax4.set_yticks([0, 1])
ax4.set_xticklabels(['x', 'y'])
ax4.set_yticklabels(['x', 'y'])
ax4.set_title('Correlation Matrix')

plt.colorbar(im, ax=ax4)
plt.tight_layout()
plt.show()
```

---

[Previous Chapter](04-oop.md) | [Next Chapter](06-files.md)
