const mongoose = require('mongoose');

async function databaseConnect(){
	try {
		await mongoose.connect(process.env.DB_URI);
		console.log("Database connected");
	} catch (error) {
		console.warn(`dataBaseConnect failed to connect to DB:\n${JSON.stringify(error)}`);
	}
}

module.exports = {
	databaseConnect
}