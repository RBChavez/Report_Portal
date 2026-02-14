-- Create Database
CREATE DATABASE ReportingDB;
GO

USE ReportingDB;
GO

-- Create Sales Table
CREATE TABLE SalesReports (
    Id INT PRIMARY KEY IDENTITY(1,1),
    ProductName NVARCHAR(100) NOT NULL,
    Category NVARCHAR(50),
    Amount DECIMAL(18, 2),
    SaleDate DATETIME DEFAULT GETDATE(),
    Region NVARCHAR(50)
);
GO

-- Seed Data
INSERT INTO SalesReports (ProductName, Category, Amount, SaleDate, Region)
VALUES 
('Professional Laptop', 'Electronics', 1200.00, '2026-02-01', 'North'),
('Wireless Mouse', 'Electronics', 25.50, '2026-02-02', 'South'),
('Designer Desk', 'Furniture', 450.00, '2026-02-03', 'East'),
('Ergonomic Chair', 'Furniture', 299.99, '2026-02-04', 'West'),
('Monitor 4K', 'Electronics', 350.00, '2026-02-05', 'North'),
('USB-C Hub', 'Electronics', 45.00, '2026-02-06', 'South'),
('Bookshelf', 'Furniture', 120.00, '2026-02-07', 'East');
GO
