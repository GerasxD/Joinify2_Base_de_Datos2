const https = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/notificaciones/505',
  method: 'GET'
};

const req = https.request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`);
  console.log(`headers:`, res.headers);

  res.on('data', (d) => {
    console.log('Respuesta del servidor:', d.toString());
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end();
