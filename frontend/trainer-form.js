document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('trainerForm');
    const submitBtn = form.querySelector('button[type="submit"]');

    function showMessage(message, isSuccess = true) {
        let msgDiv = document.getElementById('trainerFormMessage');
        if (!msgDiv) {
            msgDiv = document.createElement('div');
            msgDiv.id = 'trainerFormMessage';
            form.appendChild(msgDiv);
        }
        msgDiv.textContent = message;
        msgDiv.style.color = isSuccess ? 'green' : 'red';
        msgDiv.style.marginTop = '10px';
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';

        // Collect form data
        const data = {
            name: form.trainer_name.value,
            specialization: form.trainer_specialization.value,
            phone: form.trainer_phone.value,
            email: form.trainer_email.value
        };

        // Basic validation
        if (!data.name || !data.specialization || !data.phone || !data.email) {
            showMessage('Please fill in all required fields.', false);
            submitBtn.disabled = false;
            submitBtn.textContent = 'Add Trainer';
            return;
        }

        fetch('/api/trainers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                showMessage('Trainer added successfully!');
                form.reset();
            } else {
                showMessage(result.message || 'Error adding trainer.', false);
            }
        })
        .catch(() => {
            showMessage('Network error. Please try again.', false);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Add Trainer';
        });
    });
}); 