
function validateLogin() {
	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;
	const errorMsg = document.getElementById('errorMsg');

	if (!email || !password) {
		errorMsg.textContent = 'Entrambi i campi sono obbligatori.';
	} else if (!email.includes('@')) {
		errorMsg.textContent = 'Inserisci un indirizzo email valido.';
	} else {
		errorMsg.textContent = '';
		alert('Login effettuato con successo!');
		// Qui puoi aggiungere il reindirizzamento o ulteriori azioni.
		document.location.href="pages/prenotazioni.html";
	}
}
