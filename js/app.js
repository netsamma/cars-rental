
const API_URL = 'https://server-node-igna.vercel.app/carsRental';

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

// Richiama la funzione per caricare le prenotazioni quando la pagina viene caricata
window.onload = getBookings;

// Funzione per mostrare il modal con i dettagli
function viewBooking(button) {
const booking = JSON.parse(button.getAttribute('data-booking'));
console.log(booking);  
const formattedStartTime = new Date(booking.startTime).toLocaleDateString();
console.log("Data di inizio:", formattedStartTime);

document.getElementById('modal-id').textContent = booking._id;
document.getElementById('modal-plate').textContent = booking.carId.plate;
document.getElementById('modal-model').textContent = booking.carId.model;
document.getElementById('modal-date').textContent = formattedStartTime;
document.getElementById('modal-status').textContent = booking.status;

const modal = document.getElementById('details-modal');
modal.style.display = 'flex';
}

// Funzione per chiudere il modal
function closeModal() {
	const modal = document.getElementById('details-modal');
	modal.style.display = 'none';
}
