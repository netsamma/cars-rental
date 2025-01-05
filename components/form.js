// components/form.js

export function createForm(booking, isEditable) {
  const form = document.createElement("form");
  form.classList.add("booking-form");
  form.innerHTML = `
    <form class="modern-form">
        <div class="form-group">
            <label for="user">Cliente:</label>
            <input type="text" id="user" name="user" value="${
            booking?.user || ""
            }" ${!isEditable ? "disabled" : ""}>
        </div>
        <div class="form-group">
            <label for="date">Data:</label>
            <input type="date" id="date" name="date" value="${
            booking ? new Date(booking.startTime).toISOString().slice(0, 10) : ""
            }" ${!isEditable ? "disabled" : ""}>
        </div>
        <div class="form-group">
            <label for="time">Orario:</label>
            <input type="time" id="time" name="time" value="${
            booking ? new Date(booking.startTime).toISOString().slice(11, 16) : ""
            }" ${!isEditable ? "disabled" : ""}>
        </div>
        <div class="form-group">
            <label for="pickup">Partenza:</label>
            <input type="text" id="pickup" name="pickup" value="${
            booking?.pickup || ""
            }" ${!isEditable ? "disabled" : ""}>
        </div>
        <div class="form-group">
            <label for="dropoff">Arrivo:</label>
            <input type="text" id="dropoff" name="dropoff" value="${
            booking?.dropoff || ""
            }" ${!isEditable ? "disabled" : ""}>
        </div>
        <div class="form-group">
            <label for="status">Stato:</label>
            <select id="status" name="status" ${!isEditable ? "disabled" : ""}>
                <option value="booked" ${
                booking?.status === "booked" ? "selected" : ""
                }>Booked</option>
                <option value="active" ${
                booking?.status === "active" ? "selected" : ""
                }>Active</option>
                <option value="completed" ${
                booking?.status === "completed" ? "selected" : ""
                }>Completed</option>
                <option value="cancelled" ${
                booking?.status === "cancelled" ? "selected" : ""
                }>Cancelled</option>
            </select>
        </div>
    </form>

        ${isEditable ? '<button type="submit">Salva</button>' : ""}
    `;
  return form;
}
