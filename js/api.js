// js/api.js
const API_URL = 'https://server-node-igna.vercel.app/carsRental';

export async function fetchBookings() {
    try {
        const response = await fetch(API_URL);
        return await response.json();
    } catch (error) {
        console.error('Errore nel recupero delle prenotazioni:', error);
        throw error;
    }
}

export async function updateBooking(id, data) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return await response.json();
    } catch (error) {
        console.error('Errore durante l\'aggiornamento:', error);
        throw error;
    }
}


export async function fetchLatestLocation(carId){
    try {
        const response = await fetch(`https://server-node-igna.vercel.app/latestLocation/?carId=${carId}`)
        return await response.json();
    } catch (error) {
        console.error('Errore ultima posizione', error);
        throw error;
    }
}