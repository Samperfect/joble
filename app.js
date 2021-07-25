// requiring the needed modules
require('dotenv').config();
const fs = require('fs');
const key = fs.readFileSync('./key.pem');
const cert = fs.readFileSync('./cert.pem');
const express = require('express');
const https = require('https');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
// requiring the needed modules end

// getting the environment variables
port = process.env.PORT || 5000;
// getting the environment variables end

// connecting to the database
dbURI =
  'mongodb+srv://veehuelabs:admin@veehuelabs.com@veehue.eaigm.mongodb.net/joble?retryWrites=true&w=majority';

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    // listening for server call on PORT
    server.listen(port, () => {
      console.log('listening on port ' + port + '......');
    });
  })
  .catch((error) => console.log(error));
// connecting to the database end

// getting the express routers
const { mainRouter } = require('./routes/mainRoutes');
const { userRouter } = require('./routes/userRoutes');
// getting the express routers end

// creating the express app
const app = express();

// setting the view engine
app.set('view engine', 'ejs');

// setting the public folder
app.use(express.static('./public'));

// setting up middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// setting up middlewares end

// requiring external middile wares
require('./middlewares/utils');

// creating an express https server
const server = https.createServer({ key: key, cert: cert }, app);

// Everything relating to the main page components
app.use(mainRouter);

// Everything relating to the user compoents
app.use('/users', userRouter);

// handling 404 errors
app.all('*', (req, res) => {
  res
    .status(404)
    .send('<h1>That page does not exist</h1> <br /> <a href="/">Go home</a>');
});
