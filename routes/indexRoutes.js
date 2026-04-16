const penjualanModel = require('../models/penjualanModel');
const pelangganModel = require('../models/pelangganModel');
const produkModel = require('../models/produkModel');
const detailPenjualanModel = require('../models/detailPenjualanModel'); // ✅ Tambahan

module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: async (request, h) => {
      try {
        const penjualan = await new Promise((resolve, reject) => {
          // @ts-ignore
          penjualanModel.getAll((err, result) => {
            if (err) return reject(err);
            resolve(result);
          });
        });

        const pelanggan = await new Promise((resolve, reject) => {
          pelangganModel.getAll((err, result) => {
            if (err) return reject(err);
            resolve(result);
          });
        });

        const produk = await new Promise((resolve, reject) => {
          produkModel.getAll((err, result) => {
            if (err) return reject(err);
            resolve(result);
          });
        });

        const detailPenjualan = await new Promise((resolve, reject) => { 
          detailPenjualanModel.getAll((err, result) => {
            if (err) return reject(err);
            resolve(result);
          });
        });

        return `
          <html>
            <head>
              <title>Dashboard</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  padding: 20px;
                  background-color: #f9f9f9;
                }
                h1 {
                  color: #333;
                }
                h2 {
                  color: #555;
                  margin-top: 30px;
                }
                pre {
                  background: #eee;
                  padding: 15px;
                  border-radius: 8px;
                  overflow-x: auto;
                }
              </style>
            </head>
            <body>
              <h1>Dashboard</h1>

              <h2>Data Penjualan</h2>
              <pre>${JSON.stringify(penjualan, null, 2)}</pre>

              <h2>Data Pelanggan</h2>
              <pre>${JSON.stringify(pelanggan, null, 2)}</pre>

              <h2>Data Produk</h2>
              <pre>${JSON.stringify(produk, null, 2)}</pre>

              <h2>Data Detail Penjualan</h2>
              <pre>${JSON.stringify(detailPenjualan, null, 2)}</pre>
            </body>
          </html>
        `;
      } catch (err) {
        return h.response({
          status: 'error',
          message: 'Gagal mengambil data',
          detail: err.message
        }).code(500);
      }
    }
  }
];
