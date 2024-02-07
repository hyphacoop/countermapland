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
        popup_content = row['name_e']
        photos = [row[field] for field in ['photo1', 'photo2', 'photo3'] if row.get(field)]

        # Check if lat and lng are not empty
        if lat and lng and popup_content:
            # Append a new marker object to the list
            marker = {
                'latLng': [float(lat), float(lng)],
                'visible': True,  # Assuming you want all markers to be initially visible
                'popupContent': popup_content
            }
            if photos:
                marker['photos'] = photos
            
            markers.append(marker)

# Write the list of marker objects to a JSON file
with open(json_file_path, mode='w', encoding='utf-8') as jsonfile:
    json.dump(markers, jsonfile, indent=4)
