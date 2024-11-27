const API_URL = 'https://server-node-igna.vercel.app/carsRental';

// Variabili globali per la mappa
let map; 
let marker;
let updateIntervalId;

// Funzione per ottenere e visualizzare le prenotazioni
async function getBookings() {
    try {
        const response = await fetch(API_URL);
        const bookings = await response.json();

        const tbody = document.querySelector('#carsBookingTable tbody');
        tbody.innerHTML = ''; // Svuota la tabella

        bookings.forEach(booking => {
            const row = document.createElement('tr');
            console.log(booking);
            
            // Imposta la classe di stato per colorare la cella in base allo stato
            let statusClass = '';
            switch (booking.status) {
                case 'booked':
                    statusClass = 'status-booked'; 
                    break;
                case 'active':
                    statusClass = 'status-active'; 
                    break;
                case 'completed':
                    statusClass = 'status-completed';
                    break;
                case 'cancelled':
                    statusClass = 'status-cancelled';
                    break;
                default:
                    statusClass = '';
            }

            row.innerHTML = `
            <td class="small">${booking._id}</td>
            <td>${booking.carId.model}</td>
            <td>${booking.user}</td>
            <td>${new Date(booking.startTime).toLocaleDateString()}</td>
            <td class="${statusClass}">${booking.status}</td>
            <td class="actions">
                <button class="button-7" data-booking='${JSON.stringify(booking)}' onclick="viewBooking(this)">Visualizza</button>
                <button class="button-8" onclick="cancelBooking('${booking._id}')">Annulla</button>
            </td>
            <td>
                <div class="action-buttons">
                <button class="btn btn-details" title="Details">
                    <i class="fas fa-info-circle"></i>
                </button>
                <button class="btn btn-update" title="Update">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-delete" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
                </div>
            </td>
            `;

            tbody.appendChild(row);
        });
    } catch (error) {
        console.error("Errore nel recupero delle prenotazioni:", error);
    }
}

// Funzione per visualizzare i dettagli della prenotazione
function viewBooking(button) {
    const booking = JSON.parse(button.getAttribute('data-booking'));
    console.log(booking);  
    const formattedStartTime = new Date(booking.startTime).toLocaleDateString();
    console.log("Data di inizio:", formattedStartTime);

    // Popola i dettagli nella modale
    document.getElementById('modal-id').textContent = booking._id;
    document.getElementById('modal-plate').textContent = booking.carId.plate;
    document.getElementById('modal-model').textContent = booking.carId.model;
    document.getElementById('modal-date').textContent = formattedStartTime;
    document.getElementById('modal-status').textContent = booking.status;

    // Mostra la modale
    const modal = document.getElementById('details-modal');
    modal.style.display = 'flex';

    // Recupera l'ID dell'auto
    const carId = booking.carId._id;

    // Avvia l'aggiornamento della mappa ogni 5 secondi
    updateMap(carId); // Aggiorna subito
    updateIntervalId = setInterval(() => updateMap(carId), 5000); // Aggiorna ogni 5 secondi
}

// Funzione per recuperare l'ultima coordinata e aggiornare la posizione del marker
function updateMap(carId) {
    fetch(`https://server-node-igna.vercel.app/latestLocation`) // /${carId}
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

// Funzione per chiudere il modal
function closeModal() {
    const modal = document.getElementById('details-modal');
    modal.style.display = 'none';

    // Interrompe l'aggiornamento della mappa
    if (updateIntervalId) {
        clearInterval(updateIntervalId);
        updateIntervalId = null; // Resetta la variabile
    }

    // Rimuove la mappa dalla modale
    if (map) {
        map.remove();
        map = null;
        marker = null;
    }
}

function cancelBooking(id) {
    // Cancella la prenotazione
    console.log(id);
}

function deleteRow(id){
    // Cancella la riga dal db
    console.log(id);
}

// Richiama la funzione per caricare le prenotazioni quando la pagina viene caricata
window.onload = getBookings;
