import { fetchBookings }  from '../src/api/api.js';
import { renderTable, sortTableDynamic } from '../components/table.js';

let originalData = [];

// Definizione delle colonne
const columns = [
    { header: 'Auto', field: 'carId.model', type: 'string' },
    { header: 'Nome', field: 'user', type: 'string' },
    { header: 'Data', field: 'startTime', type: 'date' },
    { header: 'Ora', field: 'endTime', type: 'time' },
    { header: 'Partenza', field: 'pickup' },
    { header: 'Arrivo', field: 'dropoff' },
];

// Funzione principale per inizializzare la tabella
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const bookings = await fetchBookings();        
        console.log("Dati ricevuti:", bookings);
        originalData = [...bookings];
        renderTable(bookings, 'carsBookingTable', columns);
    } catch (error) {
        console.error("Errore nel recupero delle prenotazioni:", error);
    }

    // Aggiunta eventi per l'ordinamento
    initializeSorting();
});

// Funzione per inizializzare l'ordinamento delle colonne
function initializeSorting() {
    const table = document.getElementById("carsBookingTable");
    const headers = table.querySelectorAll("thead th");

    headers.forEach((header, index) => {
        if (!columns[index]) return; // Evita colonne extra non definite

        header.addEventListener("click", () => {
            const currentSort = header.getAttribute("data-sort");
            const newSort = currentSort === "asc" ? "desc" : currentSort === "desc" ? "none" : "asc";

            // Resetta gli altri header
            headers.forEach(h => h.setAttribute("data-sort", "none"));
            header.setAttribute("data-sort", newSort);

            if (newSort === "none") {
                renderTable(originalData, 'carsBookingTable', columns);
            } else {
                sortTableDynamic(originalData, columns[index].field, newSort, columns);
            }
        });
    });
}