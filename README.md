# MyAnon

A MERN-stack social media application

## Features

- Posts with comments and a score system
- JWT based authentication and authorization
- Infinite scroll using cursors (similar to reddit/twitter)
- Automated caching for all fetched data
- Instantaneous refetch on data mutation
- Responsive UI built with Tailwind CSS

## Tech Stack

### Frontend

- React (Vite for development)
- Tailwind CSS
- Redux Toolkit
- React Query
- React Router
- Axios

### Backend

- Node
- Express
- Mongoose

### Database

- MongoDB

## Project Setup

```
1. git clone https://github.com/VoidlessVoid7/MyAnon
2. cd backend
3. npm i
```
4. Create a .env file and paste the following into it (For demo purposes). Replace it with a legitimate secret and database URL if needed.

```
JWT_SECRET=abcdefg
DB_URL=mongodb://0.0.0.0:27017/myanondb
```
```
5. node app.js
6. cd ..
7. cd frontend
8. yarn
```
9. Create a file named .env and paste the following into it. Replace with the URL of the hosted backend if needed.
```
VITE_API_URL=http://localhost:3000
```
```
10. yarn dev
```
11. Open http://localhost:5173/ to access the frontend
