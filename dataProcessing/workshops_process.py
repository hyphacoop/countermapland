import csv
import json

csv_file_path = 'workshops.csv'
new_markers_file_path = 'counterMarkers.json'
existing_markers_file_path = 'markers.json'

# Initialize variables
new_markers = []
last_id = 0

# Try to read the last ID from existing data to continue IDs correctly
try:
    with open(existing_markers_file_path, 'r', encoding='utf-8') as file:
        existing_markers = json.load(file)
        if existing_markers:  # Check if existing markers are not empty
            last_id = max(int(marker['id']) for marker in existing_markers)
except FileNotFoundError:
    print(f"No existing {existing_markers_file_path} found. Starting IDs from 0.")

# Read the CSV file, trimming field names
with open(csv_file_path, mode='r', encoding='utf-8') as csvfile:
    reader = csv.reader(csvfile)
    headers = next(reader)  # Read the first line to get headers
    trimmed_headers = [header.strip() for header in headers]  # Trim spaces from headers
    dict_reader = csv.DictReader(csvfile, fieldnames=trimmed_headers)
    csvfile.seek(0)  # Reset CSV file read position after reading headers
    next(dict_reader)  # Skip the header row

    for row in dict_reader:
        last_id += 1  # Increment the last_id for a new marker
        photos = []  # Initialize photos list for current marker

        # Populate photos list, accounting for potential trailing spaces in field names
        for i in range(1, 4):  # Supports up to 3 photo links
            photo_link_key = f'PHOTO LINK {i}'.strip()  # Explicitly strip here if necessary
            if row.get(photo_link_key):  # Check if the photo link exists and is not empty
                photos.append({
                    'url': row[photo_link_key],
                    'alt': f'Photo {i}'  # Example alt text, adjust as needed
                })

        # Create a marker dict with basic information and photos
        marker = {
            'id': str(last_id),
            'latLng': [row.get('LAT', ''), row.get('LONG', '')],
            'visible': True,
            'challengesPower': True,
            'photos': photos,
            # Include other fields as needed
        }
        
        # Copy other fields, considering trimming for each value if necessary
        for header in trimmed_headers:
            if header not in ['LAT', 'LONG', f'PHOTO LINK 1', f'PHOTO LINK 2', f'PHOTO LINK 3'] and row.get(header):
                marker[header.lower().replace(' ', '_')] = row[header].strip()

        new_markers.append(marker)

# Write new markers to file
with open(new_markers_file_path, 'w', encoding='utf-8') as jsonfile:
    json.dump(new_markers, jsonfile, indent=4)

print(f"Processed {len(new_markers)} markers. New data added to {new_markers_file_path}.")
