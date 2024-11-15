// First install the dependencies:
// npm install pusher express cors fs

const express = require('express');
const path = require('path');
const cors = require('cors');
const { request } = require('http');
const fs = require('fs');
const Pusher = require("pusher");
const math = require("./functions/math");
const examsRouter = require("./routes/examsRouter");
const authRouter = require("./routes/authRouter");
const shopsRouter = require("./routes/shopsRouter");
const productsRouter = require("./routes/productsRouter");
const carsRentalRouter = require("./routes/carsRentalRouter");
const carsRouter = require("./routes/carsRouter");

const connectDB = require('./config/db_mongo');

math.intersect(2, 2, 45, 25, 12, 21, 13, 33)

const pusher = new Pusher({
  appId: "1565028",
  key: "a6f805542f862720c29e",
  secret: "4f25653f978b21211a73",
  cluster: "eu",
  useTLS: true,
});

connectDB();

const app = express();
const corsOptions = {
  origin: [
    'http://127.0.0.1:5500', 
    'http://localhost:4200', 
    'https://ignaziosammarco.vercel.app'
  ],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Consenti tutte le origini
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use('/', express.static(path.join(__dirname, 'static')));

// Rotte statiche
// app.get('/', (req, res) => res.send('Home Page Route'));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/about', (req, res) => res.send('About Page Route'));
app.get('/portfolio', (req, res) => res.send('Portfolio Page Route'));
app.get('/contact', (req, res) => res.send('Contact Page Route'));

app.use(express.static(__dirname + '/public'));


// External Routers
app.use('/exams', examsRouter)
app.use('/shops', shopsRouter)
app.use('/products', productsRouter)
app.use('/auth', authRouter)
app.use('/cars', carsRouter)
app.use('/carsRental',carsRentalRouter)

app.post("/pusher/user-auth", (req, res) => {
  const socketId = req.body.socket_id;
  const channel = "private-webchat"; //req.body.channel_name;
  // Replace this with code to retrieve the actual user id and info
  // const user = {
  //   user_id: "71",
  //   user_info: {
  //     name: "John Smith",
  //   },
  //   watchlist: ['another_id_1', 'another_id_2']
  // };
  // const authResponse = pusher.authenticateUser(socketId, user, channel);
  const authResponse = pusher.authorizeChannel(socketId, channel);
  res.send(authResponse);
});


app.post("/register", async (req, res) => {
  console.log(request.body);
  res.json({status: 'ok'})
});


app.post("/message", (req, res) => {
  var message = req.body.message;
  var name = req.body.name;
  pusher.trigger( 'private-webchat', 'client-message', { message, name });
  res.sendStatus(200);
});

const port = process.env.PORT || 5000;

app.listen(
  port, 
  () => console.log(`Server running on ${port}, http://localhost:${port}`)
);