import { fetchCars } from '../api/api.js';
import { renderTable, sortTable } from '../components/table.js';

let originalData = [];

const columns = [
    { header: 'Modello', field: 'model', type: 'string' },
    { header: 'Targa', field: 'plate', type: 'string' },
];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const bookings = await fetchCars();
        originalData = [...bookings];
        renderTable(bookings, 'carsTable', columns);
        console.log(bookings);
    } catch (error) {
        console.error("Errore nel recupero delle prenotazioni:", error);
    }
});

// Aggiunge l'evento click per l'ordinamento
document.addEventListener("DOMContentLoaded", () => {
    const table = document.getElementById("carsTable");
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
});



// const API_URL = 'https://server-node-igna.vercel.app/cars';
// // Variabili globali per la mappa
// let map; 
// let marker;
// let updateIntervalId;
// // Funzione per ottenere e visualizzare le prenotazioni
// async function getCars() {
//     try {
//         const response = await fetch(API_URL);
//         const cars = await response.json();

//         const tbody = document.querySelector('#carsTable tbody');
//         tbody.innerHTML = ''; // Svuota la tabella

//         cars.forEach(cars => {
//             const row = document.createElement('tr');
//             console.log(cars);           

//             row.innerHTML = `
//             <td>${cars.model}</td>
//             <td>${cars.plate}</td>
//             <td>${cars.available}</td>
//             <td class="actions">
//                 <button class="button-7" data-booking='${JSON.stringify(cars)}' onclick="viewCar(this)">Visualizza</button>
//                 <button class="button-8" onclick="cancelBooking('${cars._id}')">Annulla</button>
//             </td>
//             <td>
//                 <div class="action-buttons">
//                 <button class="btn btn-details" title="Details">
//                     <i class="fas fa-info-circle"></i>
//                 </button>
//                 <button class="btn btn-update" title="Update">
//                     <i class="fas fa-edit"></i>
//                 </button>
//                 <button class="btn btn-delete" title="Delete">
//                     <i class="fas fa-trash"></i>
//                 </button>
//                 </div>
//             </td>
//             `;
//             tbody.appendChild(row);
//         });
//     } catch (error) {
//         console.error("Errore nel recupero delle prenotazioni:", error);
//     }
// }

// // Funzione per visualizzare i dettagli della prenotazione
// function viewCar(button) {
//     const car = JSON.parse(button.getAttribute('data-booking'));
//     console.log(car);  

//     // Popola i dettagli nella modale
//     document.getElementById('modal-id').textContent = car._id;
//     document.getElementById('modal-plate').textContent = car.plate;
//     document.getElementById('modal-model').textContent = car.model;
//     document.getElementById('modal-status').textContent = car.available;
//     // Mostra la modale
//     const modal = document.getElementById('auto-details-modal');
//     modal.style.display = 'flex';
// }

// // Funzione per chiudere il modal
// function closeModal() {
//     const modal = document.getElementById('auto-details-modal');
//     modal.style.display = 'none';
// }

// function deleteRow(id){
//     // Cancella la riga dal db
//     console.log(id);
// }

// // Richiama la funzione per caricare le prenotazioni quando la pagina viene caricata
// window.onload = getCars;