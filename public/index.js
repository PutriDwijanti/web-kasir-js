const Inert = require('@hapi/inert');
const Hapi = require('@hapi/hapi');
const Vision = require('@hapi/vision');
const Path = require('path');

// Routes
const penjualanRoutes = require('../routes/penjualanRoutes');
const penjualanViewRoutes = require('../routes/penjualanViewRoutes');
const pelangganRoutes = require('../routes/pelangganRoutes');
const pelangganViewRoutes = require('../routes/pelangganViewRoutes');
const indexRoutes = require('../routes/indexRoutes');
const produkRoutes = require('../routes/produkRoutes');
const produkViewRoutes = require('../routes/produkViewRoutes');
const detailPenjualanRoutes = require('../routes/detailPenjualanRoutes');
const dashboardRoutes = require('../routes/dashboardRoutes'); 

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {
      cors: true
    }
  });

  // Plugin untuk view engine
  await server.register(Vision);

    // Register Vision dan Inert
  await server.register([Vision, Inert]);

  // View engine config (pakai EJS)
  server.views({
    engines: { ejs: require('ejs') },
    relativeTo: __dirname,
    path: Path.join(__dirname, '../views')
  });

    // Route static untuk folder uploads
  server.route({
    method: 'GET',
    path: '/uploads/{param*}',
    handler: {
      directory: {
        path: Path.join(__dirname, '../public/uploads'),
        listing: false
      }
    }
  });

  // Middleware untuk method override dari query param ?_method=DELETE, PUT, dll
server.ext('onRequest', (request, h) => {
  const methodOverride = request.query._method;
  if (methodOverride) {
    request.method = methodOverride.toLowerCase();
  }
  return h.continue;
});


  // Registrasi semua route
  server.route(indexRoutes);
  server.route(penjualanRoutes);
  server.route(penjualanViewRoutes);
  server.route(pelangganRoutes);         // API
  server.route(pelangganViewRoutes);     // View (EJS)
  server.route(produkRoutes);
  server.route(produkViewRoutes);     // View (EJS)
  server.route(detailPenjualanRoutes);
  server.route(dashboardRoutes);         // <--- dashboard

  await server.start();
  console.log('Server berjalan di:', server.info.uri);
};

init();
