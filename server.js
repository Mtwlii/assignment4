const express = require('express');
const { initializeDatabase } = require('./db');

const productsRoutes = require('./routes/products');
const suppliersRoutes = require('./routes/suppliers');
const salesRoutes = require('./routes/sales');
const adminDataRoutes = require('./routes/admin_data');
const reportsRoutes = require('./routes/reports');
const adminPermissionsRoutes = require('./routes/admin_permissions');

const app = express();
app.use(express.json());

app.use(adminDataRoutes);
app.use(productsRoutes);
app.use(suppliersRoutes);
app.use(salesRoutes);
app.use(reportsRoutes);
app.use(adminPermissionsRoutes);

const PORT = 3000;

// Create the database/tables first, THEN start listening for requests
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err.message);
  });
