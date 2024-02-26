import csv
import json

# Path to your downloaded CSV file
csv_file_path = 'MM.csv'

# The output JSON file
json_file_path = 'markers.json'

# Initialize an empty list to store the marker data
markers = []

# Open the CSV file and read each row
with open(csv_file_path, mode='r', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        # Extract latitude, longitude, and popup content from the correct columns
        lat = row['latitude']  
        lng = row['longitude']  
        name = row['name_e']
        municipality = row['municipality']
        id = row['id']
        description = row['background_e'] 
        photos = []

        # Check for each photo and its corresponding alt text
        for i in range(1, 4):  # up to 3 photos
            photo_key = f'photo{i}'
            alt_text_key = f'alttext{i}_e'
            if row.get(photo_key) and row.get(alt_text_key):
                # Append photo and alt text as a dict 
                photos.append({
                    'url': row[photo_key],
                    'alt': row[alt_text_key]
                })

        # Check if lat and lng are not empty
        if lat and lng and name:
            # Append a new marker object to the list
            marker = {
                'latLng': [float(lat), float(lng)],
                'visible': True,  # Assuming you want all markers to be initially visible
                'name': name,
                'municipality': municipality,
                'id': id
            }
            if photos:
                marker['photos'] = photos

            if description:
                marker['description'] = description
            
            markers.append(marker)

# Write the list of marker objects to a JSON file
with open(json_file_path, mode='w', encoding='utf-8') as jsonfile:
    json.dump(markers, jsonfile, indent=4)
