import json
import matplotlib.pyplot as plt
import numpy as np

# Function to center the plot on the screen (not needed for saving)
def center_plot():
    return None

# Step 1: Load and parse the JSON file
with open('typescript.json', 'r') as f:
    data = json.load(f)

# Step 2: Extract relevant fields
obj_types = {}

for entry in data:
    obj_type = entry['address']
    obj_type = obj_type[1:obj_type.find('*')]  # Extract object type from address

    if obj_type not in obj_types:
        obj_types[obj_type] = {'count': 1, 'length': []}  # Initialize count and length list
    else:
        obj_types[obj_type]['count'] += 1  # Increment count

    obj_types[obj_type]['length'].append(entry['length'])  # Append length

# Step 3: Calculate the median and maximum string length for each object type
for obj_type, values in obj_types.items():
    values['median_length'] = np.median(values['length'])  # Compute median of lengths
    values['max_length'] = max(values['length'])  # Compute maximum of lengths

# Step 4: Print the object types dictionary with only counts
print("\nObject Types with Counts:")
obj_types_counts_only = {obj_type: {'count': values['count']} for obj_type, values in obj_types.items()}
print(obj_types_counts_only)

# Step 5: Sort the dictionary by counts in descending order
sorted_obj_types = dict(sorted(obj_types.items(), key=lambda item: item[1]['count'], reverse=True))

# Step 6: Extract sorted counts, object types, median lengths, and max lengths for plotting
object_types = list(sorted_obj_types.keys())
counts = [sorted_obj_types[obj_type]['count'] for obj_type in object_types]
medians = [sorted_obj_types[obj_type]['median_length'] for obj_type in object_types]
max_lengths = [sorted_obj_types[obj_type]['max_length'] for obj_type in object_types]

# Step 7: Calculate strings above 2500 characters for JSLinearString and JSRope
js_types = ['JSLinearString', 'JSRope']
above_2500_counts = []
total_counts = []
above_2500_medians = []

for obj_type in js_types:
    if obj_type in obj_types:
        total_count = obj_types[obj_type]['count']  # Total number of strings
        lengths_above_2500 = [length for length in obj_types[obj_type]['length'] if length > 2500]
        above_2500_count = len(lengths_above_2500)  # Count of strings above 2500 chars
        above_2500_counts.append(above_2500_count)
        total_counts.append(total_count)

        # Calculate median length for strings above 2500 characters
        if lengths_above_2500:
            above_2500_median = np.median(lengths_above_2500)
        else:
            above_2500_median = 0  # Handle case where no strings are above 2500 characters
        above_2500_medians.append(above_2500_median)

        print(f"{obj_type}:")
        print(f"  Total strings: {total_count}")
        print(f"  Strings above 2500 characters: {above_2500_count}")
        print(f"  Median length of strings above 2500 characters: {above_2500_median}")
    else:
        print(f"{obj_type} not found in the data.")

# Step 8: Save each plot to a file instead of showing it

# Plot 1: Object Type Count
plt.figure(figsize=(8, 8))  # Square figure
plt.bar(object_types, counts, color='skyblue')
plt.title('Object Types Count (Ordered)', fontsize=16)
plt.xlabel('Object Type', fontsize=14)
plt.ylabel('Count', fontsize=14)
plt.xticks(rotation=45, ha="right")
plt.tight_layout()
plt.savefig('object_type_count.png')  # Save the plot as a PNG file

# Plot 2: Median String Length
plt.figure(figsize=(8, 8))  # Square figure
plt.bar(object_types, medians, color='lightgreen')
plt.title('Median String Length per Object Type', fontsize=16)
plt.xlabel('Object Type', fontsize=14)
plt.ylabel('Median Length (characters)', fontsize=14)
plt.xticks(rotation=45, ha="right")
plt.tight_layout()
plt.savefig('median_string_length.png')  # Save the plot as a PNG file

# Plot 3: Maximum String Length
plt.figure(figsize=(8, 8))  # Square figure
plt.bar(object_types, max_lengths, color='salmon')
plt.title('Maximum String Length per Object Type', fontsize=16)
plt.xlabel('Object Type', fontsize=14)
plt.ylabel('Max Length (characters)', fontsize=14)
plt.xticks(rotation=45, ha="right")
plt.tight_layout()
plt.savefig('max_string_length.png')  # Save the plot as a PNG file

# Plot 4: Strings above 2500 characters for JSLinearString and JSRope
plt.figure(figsize=(8, 8))  # Square figure
plt.bar(js_types, above_2500_counts, color='orange', label='Above 2500 chars')
plt.bar(js_types, total_counts, color='blue', alpha=0.3, label='Total strings')
plt.title('JSLinearString & JSRope Length Comparison', fontsize=16)
plt.xlabel('Object Type', fontsize=14)
plt.ylabel('Count', fontsize=14)
plt.legend(loc='upper left')
plt.tight_layout()
plt.savefig('jslinear_jsrope_comparison.png')  # Save the plot as a PNG file
