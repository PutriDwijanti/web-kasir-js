const DetailPenjualanController = require('../controllers/detailPenjualanController');
const PenjualanController = require('../controllers/penjualanController'); 

module.exports = [
  {
    method: 'GET',
    path: '/struk/{id}',
    handler: DetailPenjualanController.showStruk,
  },
  {
    method: 'GET',
    path: '/penjualan/detail/{id}',
    handler: DetailPenjualanController.showDetail,
  },
  {
    method: 'GET',
    path: '/api/penjualan/detail/{id}',
    handler: DetailPenjualanController.getByPenjualanIdWithProduk,
  },
];
