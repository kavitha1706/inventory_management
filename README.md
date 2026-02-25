# Inventory Management System

A modern, full-stack inventory management application designed to track products, categories, and stock levels with role-based access control and a premium dashboard.

## 🚀 Features

- **Dashboard**: High-level overview of inventory status and metrics.
- **Product Management**: Create, update, and track products with image uploads.
- **Category Management**: Organize products into categories with CRUD operations.
- **Stock Tracking**: Monitor stock levels and receive visual indicators for low stock.
- **Role-Based Access**: Permission-based interface for Admins and Staff.
- **API Documentation**: Interactive Swagger UI for backend API exploration.

## 🛠️ Tech Stack

### Backend
- **Node.js & Express**: Core server framework.
- **Sequelize ORM**: Database management and migrations.
- **PostgreSQL**: Relational database for persistent storage.
- **JWT**: Secure authentication and authorization.
- **Swagger**: API documentation and testing.

### Frontend
- **React 19**: Modern UI library.
- **Vite**: Rapid development build tool.
- **Tailwind CSS**: Utility-first styling for a premium look.
- **Lucide React**: Beautiful, consistent iconography.
- **Axios**: Promised-based HTTP client for API requests.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd inventory_management
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd inventory_backend
npm install
```

#### Database Configuration
1. Create a PostgreSQL database named `inventory_db`.
2. Create a `.env` file in the `inventory_backend` directory (or copy from `.env.example` if available).
3. Update the database credentials in `.env`:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=inventory_db
   DB_USER=your_postgres_user
   DB_PASSWORD=your_postgres_password
   JWT_SECRET=your_secure_secret_key
   UPLOAD_DIR=uploads
   ```

### 3. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd ../inventory_frontend
npm install
```

---

## 🏃 Running the Application

### Start the Backend
From the `inventory_backend` directory:
```bash
npm start
```
The server will run on [http://localhost:5000](http://localhost:5000).

### Start the Frontend
From the `inventory_frontend` directory:
```bash
npm run dev
```
The application will be available at [http://localhost:5173](http://localhost:5173).

---

## 🏗️ Database Schema

The system uses a relational PostgreSQL database with the following core entities:

### 1. **Users**
- `id`: Primary Key
- `name`: Full name of the user
- `email`: Unique login email
- `password`: Hashed password
- `role`: Access level (`admin` or `staff`)

### 2. **Categories**
- `id`: Primary Key
- `name`: Category name (e.g., Electronics)
- `description`: Optional text summary
- `isDeleted`: Boolean for soft deletion

### 3. **Products**
- `id`: Primary Key
- `name`: Product name
- `price`: Unit price (Decimal)
- `quantity`: Current stock level
- `image`: Filename of the uploaded image
- `categoryId`: Foreign Key linking to Categories

---

## 🖼️ Screenshots

*Save your screenshots directly in the main folder and name them to match the links below:*

| Dashboard | Product Management |
| :---: | :---: |
| ![Dashboard](./dashboard.png) | ![Products](./products.png) |

| Category Management | Stock Tracking |
| :---: | :---: |
| ![Categories](./categories.png) | ![Stock](./stock.png) |

---

## 🎁 Project Deliverables

- [x] **GitHub Repository**: Full source code for Frontend and Backend.
- [x] **README.md**: Setup instructions, API docs, and architecture.
- [x] **API Documentation**: Integrated Swagger UI at `/api-docs`.
- [x] **Database Schema**: Explained above.
- [x] **Screenshots Folder**: Created at `/screenshots`. (Add your images here!)

---

## 📖 API Documentation

Once the backend is running, you can access the interactive API documentation at:
[http://localhost:5000/api-docs](http://localhost:5000/api-docs)

---

## 📄 License
This project is licensed under the MIT License.
