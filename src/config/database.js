const mongoose = require('mongoose');

async function dataBaseConnect(){
	try {
		await mongoose.connect(process.env.DB_URI);
		console.log("Database connected");
	} catch (error) {
		console.warn(`databaseConnect failed to connect to DB:\n${JSON.stringify(error)}`);
	}
}

module.exports = {
	dataBaseConnect
}