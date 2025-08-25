A simple task management system with JWT authentication, built with:
Backend: ASP.NET Core (C#)
Database: PostgreSQL
Frontend: HTML/CSS/JS (static pages)
Deployment: Docker

Features:
User registration & login (JWT)  
CRUD operations for tasks  
PostgreSQL database integration  
Docker support (ready for deployment)  
Swagger API documentation 

Run with Docker:
cd TaskTracker
docker-compose up --build

API docs: http://localhost:5000/swagger
Web interface: http://localhost:5000/login.html

Простой инструмент для отслеживания выполнения задач.

Реализовано через Web API в контейнере Docker, подключено к базе данных, находящейся также. Простой интерфейс реализован двумя страницами, первая для входа и регистрации, вторая для работы с задачами.

Чтобы создать задачу, нужно ввести ее название в верхнюю строку (описание опционально)
Существует возможность изменить статус задачи (кнопка "Завершить"/"Вернуть" на каждой из отображенных ниже задач), а также удалить задачу (кнопка "Удалить" на задаче).
При наведении на Название задачи появляется ее описание для устранения визуального шума.

Dockerfile и docker-compose находятся внутри проекта.
