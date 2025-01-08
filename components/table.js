import { openModal } from '../components/modal.js';

export function renderTable(data, tableId, columns) {    
    const table = document.querySelector(`#${tableId}`);
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';

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
            let nestedValue = getNestedValue(item, col.field);

            if (col.type === 'date') {
                td.innerText = new Date(item[col.field]).toLocaleDateString();
            } else if (col.type === 'time') {
                td.innerText = new Date(item[col.field]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } else {
                td.innerText = nestedValue || '';
            }
            row.appendChild(td);
        });

        // Aggiungi il pulsante di visualizzazione per ogni riga
        const actionTd = document.createElement('td');

        const viewButton = document.createElement('button');
        viewButton.classList.add('btn-view');
        viewButton.innerHTML = '<i class="fas fa-info-circle"></i>';      
        viewButton.addEventListener('click', () => openModal(item, false));
        actionTd.appendChild(viewButton);

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn-delete');
        deleteButton.innerHTML = ' <i class="fas fa-trash"></i>';      
        deleteButton.addEventListener('click', () => deleteItem("netsam"));
        actionTd.appendChild(deleteButton);

        row.appendChild(actionTd);
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


// Funzione dinamica per ordinare colonne (supporto campi annidati json)
export function sortTableDynamic(originalData, field, sortOrder, columns) {
    const sortedData = [...originalData].sort((a, b) => {
        let valueA = getNestedValue(a, field);
        let valueB = getNestedValue(b, field);

        // Gestione dei valori vuoti
        if (valueA === undefined || valueA === null) return 1;
        if (valueB === undefined || valueB === null) return -1;

        // Ordinamento per tipo
        if (typeof valueA === 'number' && typeof valueB === 'number') {
            return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
        } else if (valueA instanceof Date && valueB instanceof Date) {
            return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
        } else {
            return sortOrder === 'asc' 
                ? String(valueA).localeCompare(String(valueB)) 
                : String(valueB).localeCompare(String(valueA));
        }
    });

    renderTable(sortedData, 'carsBookingTable', columns);
}

// Funzione per accedere ai valori annidati
function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
}