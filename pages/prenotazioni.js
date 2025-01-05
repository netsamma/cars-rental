import { fetchBookings } from '../api/api.js';
import { renderTable, sortTable } from '../components/table.js';

let originalData = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const bookings = await fetchBookings();
        originalData = [...bookings];
        renderTable(bookings);
    } catch (error) {
        console.error("Errore nel recupero delle prenotazioni:", error);
    }
});

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
    // Carica le prenotazioni iniziali
    fetchBookings()
        .then(bookings => {
            originalData = [...bookings];
            renderTable(bookings);
        })
        .catch(error => console.error("Errore nel caricamento delle prenotazioni:", error));

});