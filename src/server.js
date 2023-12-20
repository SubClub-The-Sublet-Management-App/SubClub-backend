// Server configuration happens in server.js


const express = require('express');
const cors = require('cors');

// make a server instance 
const app = express();

app.use(cors({
	// To be replace with frontend URL
    origin: ['https://thesubclubapp.netlify.app/', /(--)?thesubclubapp\.netlify\.app$/],
	credentials: true

}));

app.use(express.json());

app.get("/", (request, response) => {
	response.json({
		message:"Hello world"
	});
});

// import room routes
const roomRoutes = require('./routes/roomRouter');
app.use('/rooms', roomRoutes);

// import user routes
const userRoutes = require('./routes/userRouter');
app.use('/users', userRoutes);

// import auth routes
const authRoutes = require('./routes/authRouter');
app.use('/auth', authRoutes);

// import occupant routes
const occupantRoutes = require('./routes/occupantRouter');
app.use('/occupants', occupantRoutes);

// import room assignment routes
const roomAssignmentRoutes = require('./routes/roomAssignmentRouter');
app.use('/room-assignments', roomAssignmentRoutes);

// import payment record routes
const paymentRecordRoutes = require('./routes/paymentRecordRouter');
app.use('/payment-records', paymentRecordRoutes);

module.exports = {app}

