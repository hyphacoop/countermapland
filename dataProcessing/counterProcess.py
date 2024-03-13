import csv
import json
import re

# Function to convert DMS to decimal degrees
def dms_to_dd(dms):
    try:
        return float(dms)
    except ValueError:
        dms = re.sub(r'[^\d\w\.]+', '', dms)
        parts = re.split('[°′″]', dms)
        if len(parts) < 4:
            return None  # Invalid format
        degrees, minutes, seconds, direction = parts[0:4]
        dd = float(degrees) + float(minutes)/60 + float(seconds)/(60*60)
        if direction in ['S', 'W']:
            dd *= -1
        return dd

# Initialize variables and read the last ID
csv_file_path = 'CM.csv'
existing_markers_file_path = 'markers.json'
new_markers_file_path = 'counterMarkers.json'
last_id = 0

# Attempt to read the last ID from existing data
try:
    with open(existing_markers_file_path, 'r', encoding='utf-8') as file:
        existing_markers = json.load(file)
        last_id = max(int(marker['id']) for marker in existing_markers if marker.get('id').isdigit())
except FileNotFoundError:
    print(f"No existing {existing_markers_file_path} found. Starting IDs from 0.")

new_markers = []

# Process each row in the CSV file
with open(csv_file_path, mode='r', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        # Convert coordinates and check for validity
        lat_dd = dms_to_dd(row.get('COORDINATES - LAT / X'))
        long_dd = dms_to_dd(row.get('COORDINATES - LONG/ Y'))
        if lat_dd is None or long_dd is None:
            continue  # Skip rows without valid coordinates

        # Increment ID for each valid entry
        last_id += 1

        # Start building the marker object
        marker = {
            'id': str(last_id),
            'latLng': [lat_dd, long_dd],
            'visible': True,
            'challengesPower': True,
        }

        # Dictionary of row mappings to marker fields
        field_mappings = {
            'NAME ': 'name',
            'NAME (S)': 'name_s',
            'PLAQUE/ MARKER TEXT / INSCRIPTION ': 'inscription',
            'DISCLAIMER': 'disclaimer',
            'DATA SOURCE/S': 'dataSource',
            'DATA SOURCE/S URL': 'dataSourceURL',
            'IMAGE 1- MAIN': 'imageMain',
            'IMAGE 2 - SECONDARY': 'imageSecondary',
            'DESCRIPTION (LONG)': 'description',
            # Add mappings for other fields as necessary
        }

        # Dynamically add fields from the row to the marker based on the mappings
        for csv_field, marker_key in field_mappings.items():
            if row.get(csv_field, '').strip():
                marker[marker_key] = row[csv_field].strip()

        # Add complex or conditional fields as needed
        # Example: Adding a list of honorees, ensuring no empty values are included
        honorees = [row.get(f'HONOREES {i}', '').strip() for i in range(1, 34)]
        marker['honorees'] = [honoree for honoree in honorees if honoree]

        # Append the fully constructed marker to the list of new markers
        new_markers.append(marker)

# Write the new marker objects to the JSON file
with open(new_markers_file_path, 'w', encoding='utf-8') as jsonfile:
    json.dump(new_markers, jsonfile, indent=4)

print(f"Processed {len(new_markers)} markers. New data added to {new_markers_file_path}.")
