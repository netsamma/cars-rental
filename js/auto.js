const API_URL = 'https://server-node-igna.vercel.app/cars';

// Variabili globali per la mappa
let map; 
let marker;
let updateIntervalId;

// Funzione per ottenere e visualizzare le prenotazioni
async function getCars() {
    try {
        const response = await fetch(API_URL);
        const cars = await response.json();

        const tbody = document.querySelector('#carsTable tbody');
        tbody.innerHTML = ''; // Svuota la tabella

        cars.forEach(cars => {
            const row = document.createElement('tr');
            console.log(cars);           

            row.innerHTML = `
            <td class="small">${cars.model}</td>
            <td>${cars.plate}</td>
            <td>${cars.available}</td>
            <td class="actions">
                <button class="button-7" data-booking='${JSON.stringify(cars)}' onclick="viewCar(this)">Visualizza</button>
                <button class="button-8" onclick="cancelBooking('${cars._id}')">Annulla</button>
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
function viewCar(button) {
    const car = JSON.parse(button.getAttribute('data-booking'));
    console.log(car);  

    // Popola i dettagli nella modale
    document.getElementById('modal-id').textContent = car._id;
    document.getElementById('modal-plate').textContent = car.plate;
    document.getElementById('modal-model').textContent = car.model;
    document.getElementById('modal-status').textContent = car.available;

    // Mostra la modale
    const modal = document.getElementById('details-modal');
    modal.style.display = 'flex';

}

// Funzione per chiudere il modal
function closeModal() {
    const modal = document.getElementById('details-modal');
    modal.style.display = 'none';
}

function deleteRow(id){
    // Cancella la riga dal db
    console.log(id);
}

// Richiama la funzione per caricare le prenotazioni quando la pagina viene caricata
window.onload = getCars;
