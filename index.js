let express = require('express');
let bodyParser = express.urlencoded({ extended: true });
let dotenv = require('dotenv').config();
let path = require("path");

// modules
let runPy = require('./handlers/runPy');

// instantiate express app
let app = new express();

// app settings
app.use(bodyParser);
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.json({ limit: '1mb' }));

// routes and handlers
app.get('/', (req, res) => res.sendFile(path.join(__dirname + "/views/main.html")));
app.post('/calculate', runPy.calculate);


let PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`Listening to port: ${PORT}...`));
