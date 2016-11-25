"use strict";

const hexForChar = (name, n) => {
	let result = (Math.pow(name.charCodeAt(n), 2) % 255).toString(16);
	if (result.length === 1) {
		return `0${result}`
	} else {
		return result;
	}
}

const nameToColor = name => {
	if (!name) return "#CCC";
	return `#${hexForChar(name, 0)}${hexForChar(name, 1)}${hexForChar(name, 2)}`;
}

const sources = [
	"convex_postal",
	"convex_admin",
	"convex_trad",
	"mixed_postal",
	"mixed_admin",
	"mixed_trad"
];

document.addEventListener('DOMContentLoaded', function() {
  mapboxgl.accessToken = '<key goes here>';
  sources.forEach(source => {
		const map = new mapboxgl.Map({
			container: source,
			style: 'mapbox://styles/mapbox/streets-v9',
			center: [-4.5, 55],
			zoom: 4.8
		}).on('load', function () {
			require(`./${source}.js`).forEach(hull => {
				map.addSource(hull.name, {
					type: "geojson",
					data: {
						type: "Feature",
						geometry: {
							type: "Polygon",
							coordinates: [hull.coordinates]
						}
					}
				});
				map.addLayer({
					"id": hull.name,
					"type": "fill",
					"source": hull.name,
					"layout": {},
					"paint": {
						"fill-color": `${nameToColor(hull.name)}`,
						"fill-opacity": 0.8
					}
				})
			});
		});
  });
});
