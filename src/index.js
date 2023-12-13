// desc: This file handles the boot-up of the server 
require('dotenv').config();
const { dataBaseConnect } = require('./config/dataBase');
const { app } = require('./server');

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await dataBaseConnect();
  console.log(`Server is running on port ${PORT}`);
});