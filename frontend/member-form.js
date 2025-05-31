document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const form = document.getElementById('memberForm');
    const resetBtn = document.getElementById('resetBtn');
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');
    const trainerSelect = document.getElementById('assigned_trainer');

    // Sample trainer data (in a real app, this would come from an API)
    const trainers = [
        { id: 1, name: 'John Smith', specialty: 'Strength Training' },
        { id: 2, name: 'Sarah Johnson', specialty: 'Yoga' },
        { id: 3, name: 'Mike Chen', specialty: 'CrossFit' },
        { id: 4, name: 'Emma Wilson', specialty: 'Pilates' }
    ];

    // Populate trainer dropdown
    function populateTrainers() {
        trainers.forEach(trainer => {
            const option = document.createElement('option');
            option.value = trainer.id;
            option.textContent = `${trainer.name} (${trainer.specialty})`;
            trainerSelect.appendChild(option);
        });
    }

    // Form validation
    function validateForm() {
        let isValid = true;
        
        // Clear previous errors
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        formMessage.textContent = '';
        formMessage.className = 'form-message';

        // Name validation
        const name = document.getElementById('member_name').value.trim();
        if (name.length < 2) {
            showError('member_name', 'Please enter a valid name (min 2 characters)');
            isValid = false;
        }

        // Age validation
        const age = parseInt(document.getElementById('member_age').value);
        if (isNaN(age)) {
            showError('member_age', 'Please enter a valid age');
            isValid = false;
        } else if (age < 16 || age > 100) {
            showError('member_age', 'Age must be between 16 and 100');
            isValid = false;
        }

        // Gender validation
        const gender = document.getElementById('member_gender').value;
        if (!gender) {
            showError('member_gender', 'Please select a gender');
            isValid = false;
        }

        // Phone validation
        const phone = document.getElementById('member_phone').value.trim();
        if (!/^\d{10,15}$/.test(phone)) {
            showError('member_phone', 'Please enter a valid phone number (10-15 digits)');
            isValid = false;
        }

        // Email validation
        const email = document.getElementById('member_email').value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('member_email', 'Please enter a valid email address');
            isValid = false;
        }

        // Membership plan validation
        const plan = document.getElementById('membership_plan').value;
        if (!plan) {
            showError('membership_plan', 'Please select a membership plan');
            isValid = false;
        }

        return isValid;
    }

    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        field.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = '#e63946';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '5px';
        
        field.parentNode.appendChild(errorElement);
    }

    // Format date for display
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            
            // Send data to server
            fetch('/api/members', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: document.getElementById('member_name').value,
                    age: document.getElementById('member_age').value,
                    gender: document.getElementById('member_gender').value,
                    phone: document.getElementById('member_phone').value,
                    email: document.getElementById('member_email').value,
                    membership_plan: document.getElementById('membership_plan').value,
                    assigned_trainer: document.getElementById('assigned_trainer').value
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Show success message with member details
                    formMessage.innerHTML = `
                        <div class="success-message">
                            <p><i class="fas fa-check-circle"></i> ${data.message}</p>
                            <div class="member-details">
                                <p><strong>Member ID:</strong> <span class="highlight">${data.member_id}</span></p>
                                <p><strong>Membership Valid Until:</strong> <span class="highlight">${formatDate(data.membership_end)}</span></p>
                            </div>
                            <p class="note">Please note down the Member ID for future reference</p>
                        </div>
                    `;
                    formMessage.classList.add('success');
                    
                    // Clear form (keep trainer selection)
                    const currentTrainer = trainerSelect.value;
                    form.reset();
                    trainerSelect.value = currentTrainer;
                    
                    // Redirect after 5 seconds
                    setTimeout(() => {
                        window.location.href = 'members.html';
                    }, 5000);
                } else {
                    // Show errors
                    if (data.errors) {
                        for (const [field, message] of Object.entries(data.errors)) {
                            showError(field, message);
                        }
                    }
                    formMessage.textContent = data.message || 'An error occurred';
                    formMessage.classList.add('error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                formMessage.textContent = 'An error occurred. Please try again.';
                formMessage.classList.add('error');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Add Member';
            });
        }
    });

    // Reset form
    resetBtn.addEventListener('click', function() {
        form.reset();
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        formMessage.textContent = '';
    });

    // Initialize form
    populateTrainers();
});