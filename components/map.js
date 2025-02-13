// components/map.js

// import L from 'leaflet';

/**
 * Inizializza una mappa Leaflet nel contenitore specificato.
 * @param {string} containerId - L'ID del contenitore HTML per la mappa.
 * @param {Array} coordinates - Coordinate iniziali della mappa [lat, lng].
 * @param {number} zoom - Livello di zoom iniziale.
 */

let mapInstance = null; // Variabile globale per tenere traccia della mappa

export function createMap(containerId, coordinates = [39.9028, 13.4964], zoom = 13) {
    let mapContainer = document.getElementById(containerId);

    if (!mapContainer) {
        console.error(`Contenitore con ID ${containerId} non trovato.`);
        return null;
    }

    // Se esiste già una mappa, rimuovila
    if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
    }

    // Resetta il contenitore per evitare errori di rendering
    mapContainer.innerHTML = '';

    // Inizializza la nuova mappa
    mapInstance = L.map(mapContainer).setView(coordinates, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
    }).addTo(mapInstance);

    // Aggiunge un marker alle coordinate specificate
    L.marker(coordinates).addTo(mapInstance)
        .bindPopup('Posizione Attuale')
        .openPopup();

    // Restituisce l'istanza della mappa
    return mapInstance;
}

/**
 * Aggiunge un marker alla mappa.
 * @param {object} map - Oggetto mappa Leaflet.
 * @param {Array} coordinates - Coordinate del marker [lat, lng].
 * @param {string} popupText - Testo del popup (opzionale).
 */
export function addMarker(map, coordinates, popupText = '') {
    if (map) {
        const marker = L.marker(coordinates).addTo(map);
        if (popupText) {
            marker.bindPopup(popupText).openPopup();
        }
        return marker;
    }
    console.error("Mappa non valida per aggiungere un marker.");
}


// Funzione per recuperare l'ultima coordinata e aggiornare la posizione del marker
export function updateMap(carId) {
    fetch(`https://server-node-igna.vercel.app/latestLocation/?carId=${carId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore nel recupero delle coordinate');
            }
            return response.json();
        })
        .then(location => {
            console.log("Coordinate ricevute:", location);
            const coordinates = [location.latitude, location.longitude];

            if (!map) {
                // Inizializza la mappa solo la prima volta
                const mapContainer = document.getElementById('modal-map');
                map = L.map(mapContainer).setView(coordinates, 16);

                // Aggiungi il layer tiles alla mappa
                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    maxZoom: 19,
                    attribution: "© OpenStreetMap contributors",
                }).addTo(map);

                // Crea un marker e aggiungilo alla mappa
                marker = L.marker(coordinates).addTo(map);
            } else {
                // Sposta il marker nella nuova posizione
                marker.setLatLng(coordinates);

                // Centra la mappa sulla nuova posizione
                map.setView(coordinates, 16);
            }
        })
        .catch(error => {
            console.error("Errore:", error);
        });
}