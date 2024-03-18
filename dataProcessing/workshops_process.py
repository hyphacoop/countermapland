import csv
import json

csv_file_path = 'workshops.csv'
new_markers_file_path = 'counterMarkers.json'
last_id = 0
existing_markers_file_path = 'markers.json'

# Try to read the last ID from existing data
try:
    with open(existing_markers_file_path, 'r', encoding='utf-8') as file:
        existing_markers = json.load(file)
        last_id = max(int(marker['id']) for marker in existing_markers if marker.get('id').isdigit())
except FileNotFoundError:
    print(f"No existing {existing_markers_file_path} found. Starting IDs from 0.")

new_markers = []

with open(csv_file_path, mode='r', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        last_id += 1

        marker = {
            'id': str(last_id),
            'latLng': [row['LAT'], row['LONG']],
            'visible': True,
            'challengesPower': True,
        }
        
        # Exclude LAT and LONG from being added separately to marker
        exclude_fields = ['LAT', 'LONG']
        
        # Simplified handling for all fields directly
        for csv_field in reader.fieldnames:
            if csv_field not in exclude_fields:
                # Clean and replace nested quotes if necessary (primarily for DESCRIPTION)
                value = row[csv_field].strip().replace('""', '"') if row[csv_field] else ''
                if value:  # Only add non-empty fields to marker
                    # Convert CSV field names to lowercase for JSON keys
                    marker_key = csv_field.lower().replace(' ', '_').rstrip('_')
                    marker[marker_key] = value

        new_markers.append(marker)

with open(new_markers_file_path, 'w', encoding='utf-8') as jsonfile:
    json.dump(new_markers, jsonfile, indent=4)

print(f"Processed {len(new_markers)} markers. New data added to {new_markers_file_path}.")
