function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('registerError').textContent = '';
    document.getElementById('loginError').textContent = '';
}

function showLoginForm() {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerError').textContent = '';
    document.getElementById('loginError').textContent = '';
}

async function loginUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('loginError');
    
    if (!username || !password) {
        errorElement.textContent = "Заполните все поля";
        return;
    }
    
    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Ошибка входа');
        }
        
        const { token } = result;
        localStorage.setItem('jwtToken', token);
        window.location.href = '/index.html';
        
    } catch (error) {
        errorElement.textContent = error.message.includes('Invalid credentials') 
        ? 'Неверный логин или пароль' 
        : 'Ошибка при входе';
    }
}

async function registerUser() {
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const errorElement = document.getElementById('registerError');
    if (!username || !password) {
        errorElement.textContent = "Заполните все поля";
        return;
    }
if (password.length < 8) {
        errorElement.textContent = "Пароль слишком короткий (минимум 8 символов)";
        return;
    }
    
    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Ошибка регистрации");
        }
        
        errorElement.textContent = "Регистрация успешна! Теперь войдите";
        showLoginForm();
        
        document.getElementById('regUsername').value = '';
        document.getElementById('regPassword').value = '';
        
    } catch (error) {
        errorElement.textContent = error.message;
        console.error('Ошибка регистрации:', error);
    }
}