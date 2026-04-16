const db = require('../config/db');

const DetailPenjualan = {
  getByPenjualanIdWithProduk: async (penjualanid) => {
const query = `
SELECT 
  pd.produkid,
  pr.namaproduk,
  COALESCE(pd.qty, 0) AS qty,
  COALESCE(pd.hargasatuan, 0) AS hargasatuan,
  (COALESCE(pd.qty, 0) * COALESCE(pd.hargasatuan, 0)) AS subtotal
FROM detail_penjualan pd
JOIN produk pr ON pd.produkid = pr.produkid
WHERE pd.penjualanid = ?
`;


    try {
      const [rows] = await db.promise().query(query, [penjualanid]);
      return rows;
    } catch (err) {
      throw err;
    }
  }
};

module.exports = DetailPenjualan;
