const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
