const DashboardController = require('../controllers/dashboardController');

module.exports = [
  {
    method: 'GET',
    path: '/dashboard',
    handler: DashboardController.index
  }
];
