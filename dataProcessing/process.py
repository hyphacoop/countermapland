import csv
import json

# Path to your downloaded CSV file
csv_file_path = 'MM.csv'

# The output JSON files
json_markers_file_path = 'markers.json'
json_inscriptions_file_path = 'inscriptions.json'

# Initialize empty lists to store the marker and inscription data
markers = []
inscriptions = []

# Open the CSV file and read each row
with open(csv_file_path, mode='r', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        # Extract the necessary information
        lat = row['latitude']  
        lng = row['longitude']  
        name = row['name_e']
        municipality = row['municipality']
        id = row['id']
        description = row['background_e']
        inscription = row['inscription1']
        maintainer = row['caretaker_e']
        location = row['location_e']
        organization = row['organization']
        type = row['type_e']
        photos = []

        for i in range(1, 4):  # up to 3 photos
            photo_key = f'photo{i}'
            alt_text_key = f'alttext{i}_e'
            if row.get(photo_key) and row.get(alt_text_key):
                photos.append({
                    'url': row[photo_key],
                    'alt': row[alt_text_key]
                })

        if lat and lng and name:
            marker = {
                'latLng': [float(lat), float(lng)],
                'visible': True,
                'name': name,
                'municipality': municipality,
                'id': id,
                'maintainer': maintainer,
                'location': location,
                'type': type,
                'organization': organization
            }
            if photos:
                marker['photos'] = photos

            if description:
                marker['description'] = description

            markers.append(marker)

            if inscription:
                # Create a separate inscription object
                inscriptions.append({
                    'id': id,
                    'inscription': inscription
                })

# Write the marker objects to the markers JSON file without indentation for minification
with open(json_markers_file_path, mode='w', encoding='utf-8') as jsonfile:
    json.dump(markers, jsonfile, separators=(',', ':'))

# Write the inscription objects to the inscriptions JSON file without indentation for minification
with open(json_inscriptions_file_path, mode='w', encoding='utf-8') as jsonfile:
    json.dump(inscriptions, jsonfile, separators=(',', ':'))
