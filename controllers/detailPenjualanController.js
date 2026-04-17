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

    const detailPenjualanRaw = await DetailPenjualan.getByPenjualanIdWithProduk(id) || [];

    const detailPenjualan = detailPenjualanRaw.map(item => {
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

    const total = detailPenjualan.reduce((acc, item) => acc + item.subtotal, 0);

    return h.view('detailPenjualan/struk', {
      penjualan: {
        ...penjualan,
        bayar: penjualan.bayar || 0,
        kembalian: penjualan.kembalian || 0,
        totalharga: penjualan.totalharga || total
      },
      detailPenjualan,
      total
    });

  } catch (err) {
    console.error(err);
    return Boom.internal('Terjadi kesalahan server');
  }
},

  // Render halaman detail penjualan (tabel produk)
 showDetail: async (request, h) => {
  try {
    const id = request.params.id;

    const penjualan = await Penjualan.getById(id);
    if (!penjualan) {
      return Boom.notFound('Data tidak ditemukan');
    }

    const detailPenjualanRaw = await DetailPenjualan.getByPenjualanIdWithProduk(id) || [];

    const detailPenjualan = detailPenjualanRaw.map(item => {
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

    const total = detailPenjualan.reduce((acc, item) => acc + item.subtotal, 0);

    return h.view('detailPenjualan/detail', {
      penjualan: {
        ...penjualan,
        bayar: penjualan.bayar || 0,
        kembalian: penjualan.kembalian || 0,
        totalharga: penjualan.totalharga || total
      },
      detailPenjualan,
      total
    });

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
