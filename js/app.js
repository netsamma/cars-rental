const API_URL = 'https://server-node-igna.vercel.app/carsRental';

// Variabili globali per la mappa
let map;
let marker;
let updateIntervalId;
let originalData = []; // Per mantenere l'ordine originale dei dati

// Funzione per ottenere e visualizzare le prenotazioni
async function getBookings() {
    try {
        const response = await fetch(API_URL);
        const bookings = await response.json();

        originalData = [...bookings]; // Salva una copia per ripristinare l'ordine originale
        renderTable(bookings);
    } catch (error) {
        console.error("Errore nel recupero delle prenotazioni:", error);
    }
}

// Funzione per creare e popolare la tabella
function renderTable(bookings) {
    const tbody = document.querySelector('#carsBookingTable tbody');
    tbody.innerHTML = ''; // Svuota la tabella

    bookings.forEach(booking => {
        const row = document.createElement('tr');
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
            <td>${booking.carId.model}</td>
            <td>${booking.user}</td>
            <td>${new Date(booking.startTime).toLocaleDateString()}</td>
            <td>${new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
            <td>${booking.pickup}</td>
            <td>${booking.dropoff}</td>
            <td class="${statusClass}">${booking.status}</td>
            <td class="actions">
                <button class="button-7" data-booking='${JSON.stringify(booking)}' onclick="viewBooking(this)">Visualizza</button>
                <button class="button-8" onclick="cancelBooking('${booking._id}')">Annulla</button>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-details" title="Details"><i class="fas fa-info-circle"></i></button>
                    <button class="btn btn-update" title="Update"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-delete" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Funzione per ordinare la tabella
function sortTable(columnIndex, sortOrder) {
    const tbody = document.querySelector('#carsBookingTable tbody');
    const rows = Array.from(tbody.querySelectorAll("tr"));

    rows.sort((a, b) => {
        let cellA = a.cells[columnIndex].innerText.trim();
        let cellB = b.cells[columnIndex].innerText.trim();

        // Prova a convertire le celle in oggetti Date
        const dateA = parseDate(cellA);
        const dateB = parseDate(cellB);

        if (dateA && dateB) {
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        }

        // Se non sono date, confronta come stringhe o numeri
        if (!isNaN(cellA) && !isNaN(cellB)) {
            return sortOrder === "asc" ? cellA - cellB : cellB - cellA;
        } else {
            return sortOrder === "asc"
                ? cellA.localeCompare(cellB)
                : cellB.localeCompare(cellA);
        }
    });

    // Ripopola la tabella con le righe ordinate
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
}


// Aggiunge l'evento click per l'ordinamento
document.addEventListener("DOMContentLoaded", () => {
    const table = document.getElementById("carsBookingTable");
    const headers = table.querySelectorAll("thead th[data-sort]");

    headers.forEach((header, index) => {
        header.addEventListener("click", () => {
            const currentSort = header.getAttribute("data-sort");
            const newSort = currentSort === "asc" ? "desc" : currentSort === "desc" ? "none" : "asc";

            headers.forEach(h => h.setAttribute("data-sort", "none")); // Resetta gli altri
            header.setAttribute("data-sort", newSort);

            if (newSort === "none") {
                renderTable(originalData); // Ripristina l'ordine originale
            } else {
                sortTable(index, newSort);
            }
        });
    });

    getBookings(); // Carica i dati iniziali
});

// Funzione per visualizzare i dettagli della prenotazione
function viewBooking(button) {
    const booking = JSON.parse(button.getAttribute('data-booking'));
    const formattedDate = new Date(booking.startTime).toLocaleDateString();
    const formattedStartTime = new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    document.getElementById('modal-id').textContent = booking._id;
    document.getElementById('modal-plate').textContent = booking.carId.plate;
    document.getElementById('modal-model').textContent = booking.carId.model;
    document.getElementById('modal-customer').textContent = booking.user;
    document.getElementById('modal-date').textContent = formattedDate;
    document.getElementById('modal-time').textContent = formattedStartTime;
    document.getElementById('modal-pickup').textContent = booking.pickup;
    document.getElementById('modal-dropoff').textContent = booking.dropoff;
    document.getElementById('modal-status').textContent = booking.status;

    const modal = document.getElementById('details-modal');
    modal.style.display = 'flex';

    const carId = booking.carId._id;
    updateMap(carId);
    updateIntervalId = setInterval(() => updateMap(carId), 60000);
}

// Funzioni per aggiornare la mappa, chiudere il modal e altro rimangono invariate...

// Funzione per recuperare l'ultima coordinata e aggiornare la posizione del marker
function updateMap(carId) {
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

function parseDate(dateString) {
    // Controlla se il formato è dd/MM/yyyy
    if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        const [day, month, year] = dateString.split('/').map(Number);
        return new Date(year, month - 1, day); // Crea l'oggetto Date
    }
    return null; // Ritorna null se il formato non è valido
}