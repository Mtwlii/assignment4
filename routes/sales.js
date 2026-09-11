const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// CREATE — POST /sales (Record a sale)
router.post('/sales', async (req, res) => {
  try {
    const { ProductID, QuantitySold, SaleDate } = req.body;

    const [result] = await pool.query(
      'INSERT INTO Sales (ProductID, QuantitySold, SaleDate) VALUES (?, ?, ?)',
      [ProductID, QuantitySold, SaleDate]
    );

    res.status(201).json({ message: 'Sale recorded successfully.', SaleID: result.insertId });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ ALL — GET /sales
router.get('/sales', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Sales');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ BY PRODUCT — GET /sales/product/:productId
router.get('/sales/product/:productId', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Sales WHERE ProductID = ?', [req.params.productId]);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
