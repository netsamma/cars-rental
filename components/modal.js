// components/modal.js

import { createForm } from '../components/form.js';
import { createMap } from './map.js';
import { fetchLatestLocation } from '../js/api.js';

export async function openBookingModal(booking, isEditable) {
    const form = createForm(booking, isEditable);

    if (isEditable) {
        form.addEventListener('submit', async event => {
            event.preventDefault();
            const formData = new FormData(form);
            const updatedBooking = Object.fromEntries(formData);
            await updateBooking(booking._id, updatedBooking);
            alert('Prenotazione aggiornata con successo!');
            location.reload();
        });
    }
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Dettagli Prenotazione</h2>
                <button id="edit-button">Modifica</button>
                <button id="save-button" style="display: none;">Salva</button>
                <button class="modal-close" class="modal-close">&times;</button>
            </div>
            <div id="modal-map"></div>
        </div>
    `;
    modal.querySelector('.modal-content').appendChild(form);
    document.body.appendChild(modal);
    
    try {
        const location = await fetchLatestLocation(booking.carId._id);
        console.log(location);
        createMap("modal-map",[location.latitude,location.longitude],16)
    } catch (error) {
        console.error('Errore durante il recupero della posizione:', error);
    } 

    // Gestione dei pulsanti
    modal.querySelector('.modal-close').addEventListener('click', () => closeModal(modal));
    modal.querySelector('#edit-button').addEventListener('click', () => enableEdit(modal, form));;
    modal.querySelector('#save-button').addEventListener('click', () => SaveBooking());;
}

export function closeModal(modal) {
    document.body.removeChild(modal);
}

export function enableEdit(modal, form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => input.disabled = false);

    // Metti il focus sul primo campo e posiziona il cursore alla fine
    if (inputs.length > 0) {
        inputs[0].focus();
        const valueLength = inputs[0].value.length;
        inputs[0].setSelectionRange(valueLength, valueLength);
    }

    // Cambia i pulsanti
    modal.querySelector('#edit-button').style.display = 'none';
    modal.querySelector('#save-button').style.display = 'inline-block';
}


