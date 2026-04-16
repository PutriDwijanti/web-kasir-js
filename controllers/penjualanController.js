const Penjualan = require('../models/penjualanModel');
const DetailPenjualan = require('../models/detailPenjualanModel');
const Pelanggan = require('../models/pelangganModel');

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
  const { tanggalpenjualan, pelangganid, items } = request.payload;

  if (!tanggalpenjualan || !pelangganid || !Array.isArray(items) || items.length === 0) {
    return h.response({ message: 'Data tidak lengkap' }).code(400);
  }

  try {
    const penjualanId = await Penjualan.create({ tanggalpenjualan, pelangganid, items });
    return h.response({
      message: 'Penjualan berhasil ditambahkan',
      penjualanid: penjualanId,
    }).code(201);
  } catch (err) {
    return h.response({ error: err.message }).code(500);
  }
};

// UPDATE penjualan (hanya tanggal & pelanggan)
exports.update = async (request, h) => {
  const id = request.params.id;
  const { tanggalpenjualan, pelangganid } = request.payload;

  if (!tanggalpenjualan || !pelangganid) {
    return h.response({ message: 'Data tidak lengkap' }).code(400);
  }

  try {
    // @ts-ignore
    await Penjualan.update(id, { tanggalpenjualan, pelangganid });
    return h.response({ message: 'Penjualan berhasil diupdate' }).code(200);
  } catch (err) {
    return h.response({ error: err.message }).code(500);
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
  const id = request.params.id;

  try {
    // Ambil data penjualan
    const penjualan = await Penjualan.getById(id);
    if (!penjualan) {
      return h.response({ message: 'Struk tidak ditemukan' }).code(404);
    }

    // Ambil detail barang dengan produk
    const items = await DetailPenjualan.getByPenjualanIdWithProduk(id);

    // Ambil data pelanggan jika ada
    const pelanggan = await Pelanggan.getById(penjualan.pelangganid);

    // Mapping items dengan perhitungan subtotal dan konversi harga/jumlah ke Number
    // @ts-ignore
    const detailPenjualan = items.map(item => {
      const harga = Number(item.hargasatuan);
      const jumlah = Number(item.qty);
      const subtotal = harga * jumlah;

      return {
        namaproduk: item.namaproduk,
        jumlah,
        harga,
        subtotal
      };
    });

    // Hitung total dari subtotal
    const total = detailPenjualan.reduce((acc, item) => acc + item.subtotal, 0);

    return h.view('detailPenjualan/struk', {
      penjualan: {
        penjualanid: penjualan.penjualanid,
        tanggalpenjualan: penjualan.tanggalpenjualan
      },
      detailPenjualan,
      total
    }).code(200);

  } catch (err) {
    return h.response({ error: err.message }).code(500);
  }
};
// Menampilkan detail penjualan (mirip showStruk tapi mungkin view berbeda)
exports.showDetail = async (request, h) => {
  const id = request.params.id;
  try {
    const items = await DetailPenjualan.getByPenjualanIdWithProduk(id);
    // @ts-ignore
    if (!items || items.length === 0) {
      return h.response({ message: 'Detail penjualan tidak ditemukan' }).code(404);
    }

    // Bisa langsung return JSON atau render view lain
    return h.view('detailPenjualan/detail', { detailPenjualan: items }).code(200);
  } catch (err) {
    return h.response({ error: err.message }).code(500);
  }
};

// Mengambil detail penjualan dalam bentuk JSON (API)
exports.getByPenjualanIdWithProduk = async (request, h) => {
  const id = request.params.id;
  try {
    const items = await DetailPenjualan.getByPenjualanIdWithProduk(id);
    return h.response(items).code(200);
  } catch (err) {
    return h.response({ error: err.message }).code(500);
  }
};
