const detailController = require('../controllers/detailPenjualanController');

module.exports = [
  {
    method: 'GET',
    path: '/penjualan/{id}/detail',
    handler: async (request, h) => {
      try {
        const id = request.params.id;
        const result = await detailController.getByPenjualanIdWithProduk(id);
        return h.response(result).code(200);
      } catch (err) {
        return h.response({ error: err.message }).code(500);
      }
    }
  }
];
