# N-Tier Reporting System - Architecture & Implementation

This project implements a professional Reporting System using an N-Tier architecture (C#/.NET Core + React + SQL Server).

## 🏗️ Architecture Stack
1.  **Presentation Tier**: 
    - **React (Vite)**: Modern, responsive dashboard.
    - **CSS**: Premium glassmorphic design system.
2.  **Web Service Tier (REST API)**:
    - **ASP.NET Core Web API**: Exposes endpoints for data consumption.
3.  **Business Logic Tier (BLL)**:
    - **C# Services**: Handles business rules and data processing.
4.  **Data Access Tier (DAL)**:
    - **ADO.NET / SQL Server**: Efficient data retrieval from the database.
5.  **Database Tier**:
    - **SQL Server**: Persistent storage for sales and report data.

## 📁 Project Structure
- `/backend`: Contains the C# solution files and source code.
- `/frontend`: The React application.
- `/database`: SQL setup scripts.
- `/docs`: Documentation and architecture diagrams.

## 🚀 How to Run (Local)

### 1. Database Setup
- Open SQL Server Management Studio (SSMS).
- Execute the script in `/database/setup_db.sql`.

### 2. Backend (C#/.NET)
- Open the backend directory in Visual Studio.
- Ensure the connection string in `ReportRepository.cs` (or `appsettings.json`) matches your local SQL Server instance.
- Run the API project.

### 3. Frontend (React)
- Navigate to `/frontend`.
- Run `npm install`.
- Run `npm run dev`.
- The dashboard will be available at `http://localhost:5173`.

## 🛠️ Current Demo Mode
Since the local environment currently lacks a pre-installed .NET SDK, a **Node.js Mock REST Service** has been provided in `backend/mock_server.js` to allow you to preview the frontend immediately.

- **To see the live report**:
  1. The Mock API is running on port 5000.
  2. The React Frontend is running on port 5173.
