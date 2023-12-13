// desc: This file handles the boot-up of the server 
require('dotenv').config();
import { dataBaseConnect } from './config/database'; 

import { app } from './server';

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await dataBaseConnect();
});