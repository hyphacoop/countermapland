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
