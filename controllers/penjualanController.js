const Penjualan = require('../models/penjualanModel');
const DetailPenjualan = require('../models/detailPenjualanModel');
const Pelanggan = require('../models/pelangganModel');
const Produk = require('../models/produkModel');

// GET all penjualan lengkap dengan detail
// @ts-ignore
// @ts-ignore
exports.getAll = async (request, h) => {
  try {
    const results = await Penjualan.getAll();
    return h.response(results).code(200);
  } catch (err) {
    return h.response({ error: err.message }).code(500);
  }
};

// GET penjualan by id dengan detail barang
exports.getById = async (request, h) => {
  const id = request.params.id;
  try {
    const result = await Penjualan.getById(id);
    if (!result) {
      return h.response({ message: 'Data tidak ditemukan' }).code(404);
    }
    return h.response(result).code(200);
  } catch (err) {
    return h.response({ error: err.message }).code(500);
  }
};

// CREATE penjualan + detail penjualan (transaksi banyak barang)
exports.create = async (request, h) => {
  console.log("PAYLOAD:", request.payload);
  const { tanggalpenjualan, pelangganid, namapelanggan, items, bayar } = request.payload;

  if (!tanggalpenjualan || !pelangganid || !Array.isArray(items) || items.length === 0) {
    return h.response({ message: 'Data tidak lengkap' }).code(400);
  }

  const conn = await require('../config/db').promise().getConnection();

  try {
    await conn.beginTransaction();

    let totalharga = 0;

    // =========================
    // KURANGI STOK (AMAN)
    // =========================
    for (const item of items) {
      const pId = Number(item.produkid);
      const q = Number(item.qty);

      const [result] = await conn.query(
        `UPDATE produk 
         SET stok = stok - ? 
         WHERE produkid = ? AND stok >= ?`,
        [q, pId, q]
      );

      if (result.affectedRows === 0) {
        throw new Error(`Stok produk ID ${pId} tidak cukup`);
      }

      const harga = Number(String(item.hargasatuan).replace(/\./g, ''));
      totalharga += q * harga;
    }

    const kembalian = bayar - totalharga;

    // =========================
    // SIMPAN PENJUALAN
    // =========================
    const [penjualanResult] = await conn.query(
      `INSERT INTO penjualan 
      (pelangganid, namapelanggan, tanggalpenjualan, bayar, kembalian, totalharga)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [pelangganid, namapelanggan, tanggalpenjualan, bayar, kembalian, totalharga]
    );

    const penjualanId = penjualanResult.insertId;

    // =========================
    // SIMPAN DETAIL PENJUALAN
    // =========================
    for (const item of items) {
      await conn.query(
        `INSERT INTO detail_penjualan 
        (penjualanid, produkid, qty, hargasatuan)
        VALUES (?, ?, ?, ?)`,
        [
          penjualanId,
          item.produkid,
          item.qty,
          item.hargasatuan
        ]
      );
    }

    // =========================
    // COMMIT
    // =========================
    await conn.commit();

    return h.response({
      message: 'Penjualan berhasil & stok otomatis berkurang',
      penjualanid: penjualanId,
      totalharga,
      kembalian
    }).code(201);

  } catch (err) {
    await conn.rollback();

    console.error("ERROR TRANSAKSI:", err.message);

    return h.response({
      error: err.message
    }).code(400);

  } finally {
    conn.release();
  }
};

// DELETE penjualan beserta detail
exports.delete = async (request, h) => {
  const id = request.params.id;

  try {
    await Penjualan.delete(id);
    return h.response({ message: 'Penjualan berhasil dihapus' }).code(200);
  } catch (err) {
    return h.response({ error: err.message }).code(500);
  }
};
// GET struk penjualan by id
exports.showStruk = async (request, h) => {
  try {
    const id = request.params.id;

    const penjualan = await Penjualan.getById(id);
    if (!penjualan) {
      return h.response({ message: 'Struk tidak ditemukan' }).code(404);
    }

    const items = await DetailPenjualan.getByPenjualanIdWithProduk(id) || [];

    const pelanggan = await Pelanggan.getById(penjualan.pelangganid);

    const detailPenjualan = items.map(item => {
      const harga = Number(item.hargasatuan || 0);
      const qty = Number(item.qty || 0);

      return {
        namaproduk: item.namaproduk,
        qty,
        harga,
        subtotal: harga * qty
      };
    });

    const total = detailPenjualan.reduce((a, b) => a + b.subtotal, 0);

    return h.view('detailPenjualan/struk', {
      penjualan: {
        penjualanid: penjualan.penjualanid,
        tanggalpenjualan: penjualan.tanggalpenjualan,
        bayar: penjualan.bayar || 0,
        kembalian: penjualan.kembalian || 0,
        totalharga: penjualan.totalharga || total,
        namapelanggan: pelanggan?.namapelanggan || penjualan.namapelanggan
      },
      detailPenjualan,
      total
    });

  } catch (err) {
    console.error("ERROR STRUK:", err);
    return h.response({ error: err.message }).code(500);
  }
};
exports.update = async (request, h) => {
  const id = request.params.id;
  const { tanggalpenjualan, pelangganid } = request.payload;

  if (!tanggalpenjualan || !pelangganid) {
    return h.response({ message: 'Data tidak lengkap' }).code(400);
  }

  try {
    await Penjualan.update(id, { tanggalpenjualan, pelangganid });

    return h.response({
      message: 'Penjualan berhasil diupdate'
    }).code(200);

  } catch (err) {
    return h.response({ error: err.message }).code(500);
  }
};
// Menampilkan detail penjualan 
exports.showDetail = async (request, h) => {
  try {
    const id = request.params.id;

    const penjualan = await Penjualan.getById(id);
    if (!penjualan) {
      return h.response({ message: 'Data tidak ditemukan' }).code(404);
    }

    const items = await DetailPenjualan.getByPenjualanIdWithProduk(id) || [];

    const detailPenjualan = items.map(item => {
      const harga = Number(item.hargasatuan || 0);
      const qty = Number(item.qty || 0);

      return {
        produkid: item.produkid,
        namaproduk: item.namaproduk,
        qty,
        hargasatuan: harga,
        subtotal: harga * qty
      };
    });

    const total = detailPenjualan.reduce((a, b) => a + b.subtotal, 0);

    return h.view('detailPenjualan/detail', {
      penjualan: {
        penjualanid: penjualan.penjualanid,
        namapelanggan: penjualan.namapelanggan,
        tanggalpenjualan: penjualan.tanggalpenjualan,
        totalharga: penjualan.totalharga || total,
        bayar: penjualan.bayar || 0,
        kembalian: penjualan.kembalian || 0,
      },
      detailPenjualan,
      total
    });

  } catch (err) {
    console.error(err);
    return h.response({ error: err.message }).code(500);
  }
};
