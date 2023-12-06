// Server configuration happens in server.js

const express = require('express');

// make a server instance 
const app = express();

app.use(express.json());

app.get("/", (request, response) => {
	response.json({
		message:"Hello world"
	});
});



// import room routes
const roomRoutes = require('./routes/RoomRouter');
app.use('/rooms', roomRoutes);


// import user routes
const userRoutes = require('./routes/UserRouter');
app.use('/users', userRoutes);

module.exports = {
app}

