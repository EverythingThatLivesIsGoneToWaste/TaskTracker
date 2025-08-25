document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('jwtToken');
    
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    try {
        const validationResponse = await fetch('http://localhost:5000/api/auth/validate', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (validationResponse.status === 401) {
            localStorage.removeItem('jwtToken');
            window.location.href = '/login.html';
            return;
        }
    } catch (error) {
        console.error('Ошибка проверки токена:', error);
        localStorage.removeItem('jwtToken');
        window.location.href = '/login.html';
        return;
    }

    const API_URL = 'http://localhost:5000/api/tasks';
    
    async function loadTasks() {
        try {
            const response = await fetch(API_URL, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Ошибка загрузки задач');
            const tasks = await response.json();
            renderTasks(tasks);
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Не удалось загрузить задачи');
        }
    }

    function renderTasks(tasks) {
        const list = document.getElementById('tasksList');
        list.innerHTML = tasks.map(task => `
            <li class="${task.isCompleted ? 'completed' : ''}">
                <span class="task-title" 
                    onmouseover="showTaskDescription(event, '${task.description?.replace(/'/g, "\\'") || ''}')" 
                    onmouseout="hideTaskDescription()">
                    ${task.title}
                </span>
                <div>
                    <button onclick="toggleTask(${task.id}, ${!task.isCompleted})">
                        ${task.isCompleted ? 'Вернуть' : 'Завершить'}
                    </button>
                    <button onclick="deleteTask(${task.id})">Удалить</button>
                </div>
            </li>
        `).join('');
    }

    window.showTaskDescription = function(event, description) {
        const tooltip = document.getElementById('taskTooltip');
        if (!tooltip) return;
        tooltip.textContent = description;
        tooltip.style.display = 'block';
        tooltip.style.left = `${event.clientX + 10}px`;
        tooltip.style.top = `${event.clientY + 10}px`;
    };

    window.hideTaskDescription = function() {
        const tooltip = document.getElementById('taskTooltip');
        if (tooltip) tooltip.style.display = 'none';
    };

    window.createTask = async function() {
        const titleInput = document.getElementById('taskTitle');
        const title = titleInput.value.trim();
        const titleDescription = document.getElementById('taskDescription');
        const description = titleDescription.value.trim();
        
        if (!title) {
            alert('Введите название задачи');
            return;
        }

	if (title.length > 42) {
		alert(`Название слишком длинное (${title.length}/42)`);
		return;
	}
	if (description.length > 300) {
		alert(`Описание слишком длинное (${description.length}/300)`);
		return;
	}

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    title: title,
                    description: description,
                    isCompleted: false 
                })
            });

            if (!response.ok) throw new Error('Ошибка создания задачи');
            
            titleInput.value = '';
            titleDescription.value = '';
            await loadTasks();
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Не удалось создать задачу');
        }
    };

    window.toggleTask = async function(id, isCompleted) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(isCompleted)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка обновления задачи');
        }
        
        await loadTasks();
        } catch (error) {
            console.error('Ошибка:', error);
            alert(error.message || 'Не удалось обновить задачу');
        }
    };

    window.deleteTask = async function(id) {
        if (!confirm('Удалить задачу?')) return;
        
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Ошибка удаления задачи');
            await loadTasks();
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Не удалось удалить задачу');
        }
    };

    loadTasks();
});