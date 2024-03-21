function getCentroid(coords) {
    let sumX = 0, sumY = 0, numPoints = coords.length;

    coords.forEach(coord => {
        sumX += coord[0];
        sumY += coord[1];
    });

    return [sumX / numPoints, sumY / numPoints];
}



export async function addTerritoriesLayer(map) {
    const url = 'https://native-land.ca/wp-json/nativeland/v1/api/index.php?maps=territories';
    try {
        const response = await fetch(url);
        const data = await response.json();
        const layer = L.geoJSON(data, {
            style: feature => ({
                color: feature.properties.color,
                weight: 2,
                opacity: 0.25,
                fillOpacity: 0.25
            })
        });
        layer.addTo(map);
        return layer;
    } catch (error) {
        console.error('Error fetching territories data:', error);
    }
}

export function addTerritoriesLabels(map, data) {
    let labelsLayer = L.layerGroup(); // Create a layer group for labels
    L.geoJSON(data, {
        onEachFeature: (feature, layer) => {
            if (feature.geometry.type === "Polygon") {
                const centroid = getCentroid(feature.geometry.coordinates[0]);
                if (!isNaN(centroid[0]) && !isNaN(centroid[1])) {
                    L.marker([centroid[1], centroid[0]], {
                        icon: L.divIcon({
                            className: 'territory-label',
                            html: feature.properties.Name,
                            iconSize: L.point(100, 40)
                        })
                    }).addTo(labelsLayer); // Add to the layer group
                }
            }
        }
    });
    labelsLayer.addTo(map); // Add the entire group to the map
    return labelsLayer;
}

export async function fetchTerritoryByPosition(lat, lng) {
    const baseUrl = 'https://native-land.ca/api/index.php';
    const mapsType = 'territories'; 
    const url = `${baseUrl}?maps=${mapsType}&position=${lat},${lng}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('territories data', data)
        return data; 
    } catch (error) {
        console.error("Error fetching data: ", error);
        return null;
    }
}

export async function fetchClosestAddress(latitude, longitude) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}&format=json`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok.');
  
      const data = await response.json();
  
      // Format the address as "Street Address, City, Province, Country"
      const address = data.address;
      let formattedAddress = '';
      if (address.road) formattedAddress += `${address.road}, `;
      if (address.city || address.town) formattedAddress += `${address.city || address.town}, `;
      if (address.state) formattedAddress += `${address.state}, `;
      if (address.country) formattedAddress += address.country;
  
      return formattedAddress;
    } catch (error) {
      console.error("Error fetching closest address:", error);
      return "Address not found";
    }
  }
  
  export async function uploadImage(file) {
    const cloudName = 'dc2ikngjo'; // Your Cloudinary cloud name
    const uploadPreset = 'm277rwbw'; // Your unsigned upload preset
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
  
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      return data.secure_url; // Return the URL of the uploaded image
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  }

  export function populatePhotos(marker) {
    // First, check if the photos array is already populated
    if (marker.photos && marker.photos.length > 0) {
      return marker.photos;
    }
    let photosArray = [];

    // Check for 'photo_link' and add it to the photosArray if it exists
    if (marker.photo_link) {
      photosArray.push({
        url: marker.photo_link,
        alt: "Main Photo" // Adjust alt text as needed
      });
    }

    // Now, proceed to check for 'photo_link_1' to 'photo_link_3'
    for (let i = 1; i <= 3; i++) {
      let photoKey = `photo_link_${i}`;
      if (marker[photoKey]) {
        photosArray.push({
          url: marker[photoKey],
          alt: `Photo ${i}` // Dynamically generate alt text
        });
      }
    }

    return photosArray;
  }