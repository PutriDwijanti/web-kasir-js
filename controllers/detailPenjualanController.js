const Boom = require('@hapi/boom');
const Penjualan = require('../models/penjualanModel');
const DetailPenjualan = require('../models/detailPenjualanModel');

const controller = {
  // Render halaman struk
showStruk: async (request, h) => {
  try {
    const id = request.params.id;
    const penjualan = await Penjualan.getById(id);
    if (!penjualan) {
      return Boom.notFound('Data penjualan tidak ditemukan');
    }

    const pelanggan = { namapelanggan: penjualan.namapelanggan || 'Umum' };

    const detailPenjualanRaw = await DetailPenjualan.getByPenjualanIdWithProduk(id);
    // @ts-ignore
    const detailPenjualan = detailPenjualanRaw.map(item => ({
      produkid: item.produkid,
      namaproduk: item.namaproduk,
      jumlah: item.qty,
      hargasatuan: Number(item.hargasatuan).toFixed(2),
      subtotal: (item.qty * item.hargasatuan).toFixed(2),
    }));

    // Hitung total
    const total = detailPenjualan.reduce((acc, item) => acc + parseFloat(item.subtotal), 0);

    return h.view('detailPenjualan/struk', { penjualan, pelanggan, detailPenjualan, total });

  } catch (err) {
    console.error(err);
    return Boom.internal('Terjadi kesalahan server');
  }
},



  // Render halaman detail penjualan (tabel produk)
  showDetail: async (request, h) => {
    try {
      const id = request.params.id;
      const detailPenjualanRaw = await DetailPenjualan.getByPenjualanIdWithProduk(id);

      // @ts-ignore
      const detailPenjualan = detailPenjualanRaw.map(item => ({
        produkid: item.produkid,
        namaproduk: item.namaproduk,
        qty: item.qty,
        hargasatuan: Number(item.hargasatuan).toFixed(2),
        subtotal: (item.qty * item.hargasatuan).toFixed(2),
      }));

      const total = detailPenjualan.reduce((acc, item) => acc + parseFloat(item.subtotal), 0).toFixed(2);

      return h.view('detailPenjualan/detail', { detailPenjualan, total });


    } catch (err) {
      console.error(err);
      return Boom.internal('Terjadi kesalahan server');
    }
  },

  // API JSON detail penjualan
  getByPenjualanIdWithProduk: async (request, h) => {
    const id = request.params.id;
    try {
      const items = await DetailPenjualan.getByPenjualanIdWithProduk(id);
      // @ts-ignore
      const formattedItems = items.map(item => ({
        produkid: item.produkid,
        namaproduk: item.namaproduk,
        qty: item.qty,
        hargasatuan: Number(item.hargasatuan).toFixed(2),
        subtotal: Number(item.subtotal).toFixed(2),
      }));
      return h.response(formattedItems).code(200);
    } catch (err) {
      return h.response({ error: err.message }).code(500);
    }
  },
};

module.exports = controller;
