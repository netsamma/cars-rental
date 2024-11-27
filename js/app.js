const API_URL = 'https://server-node-igna.vercel.app/carsRental';
let map; // Variabile globale per la mappa

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

// Funzione per mostrare il modal con i dettagli e la mappa
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

    // Recupera le coordinate dal server
	// fetch(`https://server-node-igna.vercel.app/latestLocation/${carId}`)
    fetch(`https://server-node-igna.vercel.app/latestLocation`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore nel recupero delle coordinate');
            }
            return response.json();
        })
        .then(location => {
            console.log("Coordinate ricevute:", location);
            // const coordinates = location.coordinates || [38.1157, 13.3615]; // Default: Palermo
		
			// Si deve modificare server API (restituire array? oppure mettere label 
			// se si vuole restituire una sola coppia di coord)

			// Converti latitude e longitude in un array di coordinate
			const coordinates = [location.latitude, location.longitude];
            initMap(coordinates);
        })
        .catch(error => {
            console.error("Errore:", error);
            // Mostra una mappa con una posizione predefinita in caso di errore
            initMap([38.1157, 13.3615]);
        });
}

// Funzione per chiudere il modal
function closeModal() {
	const modal = document.getElementById('details-modal');
	modal.style.display = 'none';

	// Rimuove la mappa dalla modale
	if (map) {
		map.remove();
		map = null;
	}
}


function initMap(coordinates) {
	const mapContainer = document.getElementById('modal-map');

	// Rimuove eventuali mappe esistenti
	if (map) {
		map.remove();
	}
	// Crea una nuova mappa
	map = L.map(mapContainer).setView(coordinates, 13);
	map.setZoom(16);

	L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
		maxZoom: 19,
		attribution: "© OpenStreetMap contributors",
	}).addTo(map);

	// Aggiunge un marker per la posizione del veicolo
	L.marker(coordinates).addTo(map).bindPopup("Posizione Veicolo").openPopup();
}


function cancelBooking(id) {
	// cancella la prenotazione
	console.log(id);
}

function deleteRow(id){
	// cancella la riga dal db
	console.log(id);
}

// Richiama la funzione per caricare le prenotazioni quando la pagina viene caricata
window.onload = getBookings;
