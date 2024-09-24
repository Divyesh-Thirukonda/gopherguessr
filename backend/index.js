const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');

// Enable CORS to allow requests from the frontend
fastify.register(cors, {
  origin: '*' // Allow all origins, you can replace with your frontend URL for better security
});

// In-memory locations data
const locations = [
  { latitude: 48.858844, longitude: 2.294351, country: 'France'},   // Eiffel Tower
  { latitude: 40.689247, longitude: -74.044502, country: 'USA' },    // Statue of Liberty
  { latitude: 35.658581, longitude: 139.745438, country: 'Japan' },  // Tokyo Tower
  { latitude: -22.951916, longitude: -43.210487, country: 'Brazil' },// Christ the Redeemer
  { latitude: -33.856784, longitude: 151.215297, country: 'Australia' }// Sydney Opera House
];

// Define route to serve random location
fastify.get('/random-location', async (request, reply) => {
  const randomIndex = Math.floor(Math.random() * locations.length);
  const location = locations[0]; // sub 0 with randomIndex
  reply.send(location);
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3001 });
    console.log('Server running on http://localhost:3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
