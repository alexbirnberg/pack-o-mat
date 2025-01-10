import re

def analyze_compression():
    # Initialize variables to track compression statistics
    total_original_bytes = 0
    total_compressed_bytes = 0
    compression_entries = 0

    # Read the input from a file (modify the filename as needed)
    with open('pack-o-mat-log.txt', 'r') as file:
        for line in file:
            # Look for compression entries
            compress_match = re.search(r' compress (\w+) => (\w+)', line)
            if compress_match:
                # Convert hex strings to integers representing byte sizes
                original_bytes = int(compress_match.group(1), 16)
                compressed_bytes = int(compress_match.group(2), 16)

                print(hex(original_bytes), hex(compressed_bytes))

                total_original_bytes += original_bytes
                total_compressed_bytes += compressed_bytes
                compression_entries += 1

    # Calculate compression ratio
    if compression_entries > 0:
        avg_original_size = total_original_bytes / compression_entries
        avg_compressed_size = total_compressed_bytes / compression_entries
        compression_ratio = total_original_bytes / total_compressed_bytes

        # Print results
        print(f"Compression Analysis:")
        print(f"Total Original Bytes: {total_original_bytes}")
        print(f"Total Compressed Bytes: {total_compressed_bytes}")
        print(f"Number of Compression Entries: {compression_entries}")
        print(f"Average Original Size: {avg_original_size:.2f} bytes")
        print(f"Average Compressed Size: {avg_compressed_size:.2f} bytes")
        print(f"Compression Ratio: {compression_ratio:.2f}")
        print(f"Compression Percentage: {(1 - total_compressed_bytes/total_original_bytes)*100:.2f}%")

    else:
        print("No compression entries found.")

# Run the analysis
if __name__ == '__main__':
    analyze_compression()