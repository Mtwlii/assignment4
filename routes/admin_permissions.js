const express = require('express');
const { rootPool } = require('../db');

const router = express.Router();

// Task 14 — Create MySQL user 'store_manager' and grant SELECT, INSERT, UPDATE on all tables
router.post('/admin/create-store-manager', async (req, res) => {
  try {
    await rootPool.query(
      "CREATE USER IF NOT EXISTS 'store_manager'@'localhost' IDENTIFIED BY 'StoreManagerPass123!'"
    );
    await rootPool.query(
      "GRANT SELECT, INSERT, UPDATE ON store_db.* TO 'store_manager'@'localhost'"
    );
    await rootPool.query('FLUSH PRIVILEGES');

    res.status(201).json({ message: 'store_manager user created with SELECT, INSERT, UPDATE permissions.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Task 15 — Revoke UPDATE permission from store_manager
router.post('/admin/revoke-update', async (req, res) => {
  try {
    await rootPool.query("REVOKE UPDATE ON store_db.* FROM 'store_manager'@'localhost'");
    await rootPool.query('FLUSH PRIVILEGES');

    res.status(200).json({ message: 'UPDATE permission revoked from store_manager.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Task 16 — Grant DELETE permission to store_manager, only on the Sales table
router.post('/admin/grant-delete-sales', async (req, res) => {
  try {
    await rootPool.query("GRANT DELETE ON store_db.Sales TO 'store_manager'@'localhost'");
    await rootPool.query('FLUSH PRIVILEGES');

    res.status(200).json({ message: 'DELETE permission on Sales table granted to store_manager.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
