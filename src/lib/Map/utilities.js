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
        L.geoJSON(data, {
            style: feature => ({
                color: feature.properties.color,
                weight: 2,
                opacity: 0.25,
                fillOpacity: 0.25
            })
        }).addTo(map);
    } catch (error) {
        console.error('Error fetching territories data:', error);
    }
}

export function addTerritoriesLabels(map, data) {
    console.log('Adding territory labels');
    L.geoJSON(data, {
        onEachFeature: (feature, layer) => {
            if (feature.geometry.type === "Polygon") {
                console.log('Adding label for', feature.properties.Name)
                const centroid = getCentroid(feature.geometry.coordinates[0]);                 console.log('Centroid:', centroid)
                if (!isNaN(centroid[0]) && !isNaN(centroid[1])) {
                    L.marker([centroid[1], centroid[0]], {
                        icon: L.divIcon({
                            className: 'territory-label',
                            html: feature.properties.Name,
                            iconSize: L.point(100, 40)
                        })
                    }).addTo(map);
                }
            }
        }
    });
}
