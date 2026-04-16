const db = require('../config/db');

module.exports = {
  index: async (request, h) => {
    try {
      const getCount = (table) => {
        return new Promise((resolve, reject) => {
          db.query(`SELECT COUNT(*) AS count FROM ${table}`, (err, results) => {
            if (err) return reject(err);
            resolve(results[0].count);
          });
        });
      };

      const getRecentPenjualan = () => {
        return new Promise((resolve, reject) => {
          db.query(`
            SELECT penjualan.penjualanid, penjualan.tanggalpenjualan, penjualan.totalharga, pelanggan.namapelanggan
            FROM penjualan
            LEFT JOIN pelanggan ON penjualan.pelangganid = pelanggan.pelangganid
            ORDER BY penjualan.tanggalpenjualan DESC
            LIMIT 5
          `, (err, results) => {
            if (err) return reject(err);
            resolve(results);
          });
        });
      };

      const totalProduk = await getCount('produk');
      const totalPelanggan = await getCount('pelanggan');
      const totalPenjualan = await getCount('penjualan');
      const penjualanTerbaru = await getRecentPenjualan();

      console.log({ totalProduk, totalPelanggan, totalPenjualan, penjualanTerbaru });

      return h.view('dashboard/index', {
        title: 'Dashboard',
        totalProduk,
        totalPelanggan,
        totalPenjualan,
        penjualanTerbaru
      });
    } catch (error) {
      console.error('Error di dashboard index:', error);
      return h.response('Internal Server Error').code(500);
    }
  }
};
