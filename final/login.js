document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('userId', data.user.id);
                localStorage.setItem('username', data.user.username);
                alert('Login successful!');
                window.location.href = 'my-listings.html';
            } else {
                alert('Login failed: Invalid credentials.');
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    });
});