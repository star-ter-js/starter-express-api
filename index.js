const path = require('path');
const express = require('express');
const cors= require('cors');
const { port } = require('./config/server');
const routes = require('./config/routes');
const { addRoutersInApp } = require('./routers');

const app = express();

// enable cors
app.use(cors());
// body parser
app.post(express.json());

app.all('/', (req, res) => res.end('EXPRESS works fine!'));
addRoutersInApp(routes, app);
app.use(express.static(path.join(__dirname, './public')));
//handling errors
app.use((req, res) => res.end('RESOURCE NOT FOUND!!'));

app.set('port', (process.env.PORT || port));
app.listen(app.get('port'), () => console.log('server is running on port:', app.get('port')));
