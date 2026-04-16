const pool = require('../config/db');

const Penjualan = {
  create: async ({ pelangganid, namapelanggan, tanggalpenjualan, items }) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error('Items tidak boleh kosong dan harus berupa array.');
    }

    let conn;
    try {
      conn = await pool.promise().getConnection();
      await conn.beginTransaction();

      // Hitung total harga dari items
      const totalharga = items.reduce((sum, item) => sum + (item.qty * item.hargasatuan), 0);

      // Insert ke tabel penjualan (dengan totalharga)
      const [result] = await conn.query(
        'INSERT INTO penjualan (pelangganid, tanggalpenjualan, namapelanggan, totalharga) VALUES (?, ?, ?, ?)',
        [pelangganid, tanggalpenjualan, namapelanggan, totalharga]
      );

      // @ts-ignore
      const penjualanid = result.insertId;

      // Insert detail penjualan
      const insertDetailPromises = items.map(item =>
        conn.query(
          'INSERT INTO detail_penjualan (penjualanid, produkid, qty, hargasatuan) VALUES (?, ?, ?, ?)',
          [penjualanid, item.produkid, item.qty, item.hargasatuan]
        )
      );
      await Promise.all(insertDetailPromises);

      await conn.commit();
      return penjualanid;
    } catch (err) {
      if (conn) await conn.rollback();
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },

  getAll: async () => {
    const query = `
      SELECT 
        p.penjualanid,
        p.pelangganid,
        p.tanggalpenjualan,
        pl.namapelanggan,
        IFNULL(SUM(dp.qty * dp.hargasatuan), 0) AS totalharga
      FROM penjualan p
      JOIN pelanggan pl ON p.pelangganid = pl.pelangganid
      LEFT JOIN detail_penjualan dp ON p.penjualanid = dp.penjualanid
      GROUP BY p.penjualanid, p.tanggalpenjualan, pl.namapelanggan
      ORDER BY p.tanggalpenjualan DESC
    `;

    try {
      const [results] = await pool.promise().query(query);
      return results;
    } catch (err) {
      throw err;
    }
  },

  getById: async (id) => {
    const penjualanQuery = `
      SELECT p.penjualanid, p.tanggalpenjualan, pl.pelangganid, pl.namapelanggan
      FROM penjualan p
      JOIN pelanggan pl ON p.pelangganid = pl.pelangganid
      WHERE p.penjualanid = ?
    `;

    const detailQuery = `
      SELECT 
        pd.produkid,
        pr.namaproduk,
        pd.qty,
        pd.hargasatuan,
        (pd.qty * pd.hargasatuan) AS subtotal
      FROM detail_penjualan pd
      JOIN produk pr ON pd.produkid = pr.produkid
      WHERE pd.penjualanid = ?
    `;

    try {
      const [penjualanResult] = await pool.promise().query(penjualanQuery, [id]);
      // @ts-ignore
      if (penjualanResult.length === 0) return null;

      const [detailResult] = await pool.promise().query(detailQuery, [id]);

      const penjualan = penjualanResult[0];
      penjualan.items = detailResult;
      // @ts-ignore
      penjualan.total = detailResult.reduce((sum, item) => sum + item.subtotal, 0);

      return penjualan;
    } catch (err) {
      throw err;
    }
  },

  update: async (id, { pelangganid, tanggalpenjualan, items }) => {
    let conn;
    try {
      conn = await pool.promise().getConnection();
      await conn.beginTransaction();

      // Update data penjualan
      await conn.query(
        'UPDATE penjualan SET pelangganid = ?, tanggalpenjualan = ? WHERE penjualanid = ?',
        [pelangganid, tanggalpenjualan, id]
      );

      if (items !== undefined) {
        if (!Array.isArray(items) || items.length === 0) {
          await conn.rollback();
          throw new Error('Items harus berupa array dan tidak boleh kosong jika diupdate.');
        }

        // Hapus detail lama
        await conn.query('DELETE FROM detail_penjualan WHERE penjualanid = ?', [id]);

        // Insert detail baru
        const insertDetailPromises = items.map(item =>
          conn.query(
            'INSERT INTO detail_penjualan (penjualanid, produkid, qty, hargasatuan) VALUES (?, ?, ?, ?)',
            [id, item.produkid, item.qty, item.hargasatuan]
          )
        );
        await Promise.all(insertDetailPromises);
      }

      await conn.commit();
      return true;
    } catch (err) {
      if (conn) await conn.rollback();
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },

  delete: async (id) => {
    let conn;
    try {
      conn = await pool.promise().getConnection();
      await conn.beginTransaction();

      // Hapus detail penjualan dulu
      await conn.query('DELETE FROM detail_penjualan WHERE penjualanid = ?', [id]);

      // Hapus dari tabel penjualan
      const [result] = await conn.query('DELETE FROM penjualan WHERE penjualanid = ?', [id]);

      await conn.commit();

      // @ts-ignore
      return result.affectedRows > 0;
    } catch (err) {
      if (conn) await conn.rollback();
      throw err;
    } finally {
      if (conn) conn.release();
    }
  }
};

module.exports = Penjualan;
