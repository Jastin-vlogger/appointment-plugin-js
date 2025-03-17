const AppointmentPlugin = (function () {
    let apiBaseUrl = '';
    let selectedSlot = null 
    function init(config) {
        apiBaseUrl = config.apiBaseUrl || '';
        
        const container = document.getElementById('appointment-container');
        if (!container) return;

        container.innerHTML = `
            <label for="date">Select Date:</label>
            <input type="date" id="date">
            <button id="fetch-slots">Check Slots</button>
            <div id="slots"></div>
            <div id="booking-form" style="display: none;">
                <h3>Book Appointment</h3>
                <input type="text" id="name" placeholder="Your Name">
                <input type="tel" id="phone" placeholder="Phone Number">
                <button id="book-appointment">Book Now</button>
            </div>
            <p id="status"></p>
        `;

        document.getElementById('fetch-slots').addEventListener('click', fetchAvailableSlots);
    }

    async function fetchAvailableSlots() {
        const date = document.getElementById('date').value;
        if (!date) {
            alert('Please select a date.');
            return;
        }

        const slotsDiv = document.getElementById('slots');
        slotsDiv.innerHTML = '<p>Loading slots...</p>';

        try {
            const response = await fetch(`${apiBaseUrl}/appointment/slots?date=${date}`);
            const slots = await response.json();

            slotsDiv.innerHTML = '';
            slots.forEach(slot => {
                const button = document.createElement('button');
                button.textContent = slot;
                button.classList.add('slot-btn');
                button.onclick = () => selectSlot(slot, button);
                slotsDiv.appendChild(button);
            });
        } catch (error) {
            slotsDiv.innerHTML = '<p>Failed to load slots.</p>';
        }
    }

    function selectSlot(slot, slotElement) {
        document.getElementById('booking-form').style.display = 'block';
        if (selectedSlot) {
            selectedSlot.classList.remove('selected');
          }
          selectedSlot = slotElement;
          selectedSlot.classList.add('selected'); 
        document.getElementById('book-appointment').onclick = () => bookAppointment(slot);
    }

    async function bookAppointment(slot) {
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const date = document.getElementById('date').value;

        if (!name || !phone || !date) {
            alert('Please fill all details.');
            return;
        }

        try {
            const response = await fetch(`${apiBaseUrl}/appointment/book`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phoneNumber: phone, date, timeSlot: slot }),
            });

            const result = await response.json();
            document.getElementById('status').textContent = result.message || 'Booking successful!';
            fetchAvailableSlots();
            resetForm();
        } catch (error) {
            document.getElementById('status').textContent = 'Failed to book appointment.';
        }
    }

    function resetForm() {
         document.getElementById('name').value = null;
         document.getElementById('phone').value = null;
    }

    return { init };
})();
