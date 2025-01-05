// components/table.js

import { openBookingModal } from '../components/modal.js';

export function renderTable(bookings) {
    const tbody = document.querySelector('#carsBookingTable tbody');
    tbody.innerHTML = '';

    bookings.forEach(booking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${booking.carId.model}</td>
            <td>${booking.user}</td>
            <td>${new Date(booking.startTime).toLocaleDateString()}</td>
            <td>${new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
            <td>${booking.pickup}</td>
            <td>${booking.dropoff}</td>
            <td>${booking.status}</td>
            <td>
                <button class="btn-view" data-id="${booking._id}">Visualizza</button>
            </td>
        `;
        tbody.appendChild(row);
        row.querySelector('.btn-view').addEventListener('click', () => openBookingModal(booking, false));
    });
}

export function renderTableGeneral(data, tableId, columns) {
    console.log(columns);
    
    const table = document.querySelector(`#${tableId}`);
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = ''; // Pulisce la tabella

    // Crea le intestazioni dinamicamente
    const thead = table.querySelector('thead');
    thead.innerHTML = ''; // Pulisce l'intestazione
    const headerRow = document.createElement('tr');
    columns.forEach(col => {
        const th = document.createElement('th');
        th.innerText = col.header;
        headerRow.appendChild(th);
    });
    const th = document.createElement('th');
    th.innerText = "Azioni";
    headerRow.appendChild(th);

    thead.appendChild(headerRow);

    // Aggiungi le righe della tabella
    data.forEach(item => {
        const row = document.createElement('tr');

        columns.forEach(col => {
            const td = document.createElement('td');
            if (col.type === 'date') {
                td.innerText = new Date(item[col.field]).toLocaleDateString();
            } else if (col.type === 'time') {
                td.innerText = new Date(item[col.field]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } else {
                td.innerText = item[col.field] || ''; // Visualizza il valore del campo
            }
            row.appendChild(td);
        });

        // Aggiungi il pulsante di visualizzazione per ogni riga
        const viewButtonTd = document.createElement('td');
        const viewButton = document.createElement('button');
        viewButton.classList.add('btn-view');
        viewButton.innerText = 'Visualizza';
        viewButton.addEventListener('click', () => openBookingModal(item, false)); // Apertura modale per visualizzare
        viewButtonTd.appendChild(viewButton);
        row.appendChild(viewButtonTd);

        tbody.appendChild(row);
    });
}


// Funzione per ordinare la tabella
export function sortTable(columnIndex, sortOrder) {
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

function parseDate(dateString) {
    // Controlla se il formato è dd/MM/yyyy
    if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        const [day, month, year] = dateString.split('/').map(Number);
        return new Date(year, month - 1, day); // Crea l'oggetto Date
    }
    return null; // Ritorna null se il formato non è valido
}