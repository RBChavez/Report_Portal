# Walkthrough: Creating the N-Tier Reporting System

This document outlines the steps taken to build the Reporting System.

## Step 1: Project Initialization
Created the root directory `ReportingSystem` and structured it for a clean separation of concerns:
- `backend/` for the web service.
- `frontend/` for the React application.
- `database/` for SQL scripts.

## Step 2: Database Design
Defined a `SalesReports` table in SQL Server. The schema includes standard fields like `ProductName`, `Category`, `Amount`, and `Region`. Added seed data to populate the initial report.

## Step 3: Backend Implementation (C#)
Implemented the N-tier architecture:
- **Models**: Defined the `SalesReport` entity.
- **Data Access Layer (DAL)**: Created a repository using `SqlConnection` and `SqlCommand` for raw SQL efficiency.
- **Business Logic Layer (BLL)**: Created a service to encapsulate the retrieval logic.
- **REST API Controller**: Exposed a GET endpoint `/api/report` to serve the data.

## Step 4: Frontend Development (React)
- Initialized a **Vite + React + TypeScript** project.
- Crafted a **Premium UI** in `index.css` using modern techniques (glassmorphism, gradients, Outfit font).
- Implemented `App.tsx` which fetches data from the API and calculates summary metrics (Total Revenue, Transaction count).

## Step 5: Bridging the Gap (Mock Service)
To ensure the system is immediately testable without a local .NET build environment, I created a lightweight Node.js service (`mock_server.js`) that mimics the C# API's response format.

## Step 6: Advanced Features & Polish
- **Export Functionality**: Added a "Export CSV" trigger to the Transaction Registry, allowing users to download filtered data for external auditing.
- **Service Desk Enhancements**: Integrated a "Recent Submissions" sidebar within the Ticket view to simulate historical tracking of support requests.
- **UX Refinements**: Added search functionality and status badges for better data discoverability.

---
**Note:** The system is currently running localized services for immediate preview.
- **API**: http://localhost:5000
- **Frontend**: http://localhost:5173
