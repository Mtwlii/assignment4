const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// Task 9 — Total quantity sold for each product (aggregate SUM + GROUP BY)
router.get('/reports/quantity-sold', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.ProductID, p.ProductName, COALESCE(SUM(s.QuantitySold), 0) AS TotalQuantitySold
      FROM Products p
      LEFT JOIN Sales s ON p.ProductID = s.ProductID
      GROUP BY p.ProductID, p.ProductName
    `);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Task 10 — Product with the highest stock quantity
router.get('/reports/highest-stock', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Products ORDER BY StockQuantity DESC LIMIT 1'
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No products found.' });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Task 11 — Suppliers whose names start with 'F'
router.get('/reports/suppliers-starting-f', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Suppliers WHERE SupplierName LIKE 'F%'");
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Task 12 — Products that have never been sold (LEFT JOIN + IS NULL)
router.get('/reports/never-sold', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*
      FROM Products p
      LEFT JOIN Sales s ON p.ProductID = s.ProductID
      WHERE s.SaleID IS NULL
    `);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Task 13 — All sales with product name, quantity sold, and sale date (JOIN)
router.get('/reports/sales-details', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.ProductName, s.QuantitySold, s.SaleDate
      FROM Sales s
      JOIN Products p ON s.ProductID = p.ProductID
    `);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
