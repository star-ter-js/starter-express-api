# Basic rest api with express framework for node

## install

```bash
$ git clone https://github.com/star-ter-js/starter-express-api.git
$ cd starter-express-api
$ npm install
$ npm run serve
```
Server runs at this address http://localhost:8888/

## getting started: geocoder example

In `app/services` directory put code like this in "*esriGeocode.service.js*" file:

```javascript
// services/esriGeocode.service.js
const fetch = require('node-fetch');

async function geocode(address) {
  address = encodeURIComponent(address.trim());
  const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/FindAddressCandidates?F=pjson&SingleLine=${address}`;
  
  try {
    let resp = await fetch(url).then(resp => resp.json());

    //do stuff with "resp"

    return resp;
  } catch (err) {
    throw new Error(err);
  }
} // geocode

module.exports = geocode;
```

that you can use in routers definition file in `app/routers` directory

```javascript
// routers/esriGeocode.router.js
const express = require('express');
const {addRoute} = require('.');
const geocode = require('../services/esriGeocode.service.js');

let router = express.Router();
addRoute({
  router,
  path: '/:address',
  method: 'GET',
  transformRequest: req => req.params.address,
  getResponce: geocode,
  transformResponce: resp => resp.candidates.map(candidate => `${candidate.address} [${candidate.extent.xmin}, ${candidate.extent.ymin}, ${candidate.extent.xmax}, ${candidate.extent.ymax}]`),
});

module.exports = router;
```

and finnally in `config/routes.js`

```javascript
// config/routes.js
const routes = {
  .....
  '/geocode': 'esriGeocode.router',
  ....
}; // routes
module.exports = routes;
```

Now in the working directory you can type

```bash
npm  run serve
```

in the browser you can type "http://localhost:8888/geocode/empire+state+building+ny" and you can get the response:

```json
{
  "status": "OK",
  "results": [
    "Empire State Building [-73.99066999999997, 40.74343000000004, -73.98066999999998, 40.753430000000044]"
  ],
  "items": 1
}
```

## set expresss ROUTER

addRoute function input

- **router**: `express.Router` instance;
- **method**: method router (`'GET'` `'POST'`, etc)
- **url**: `string` endpoint api;
- **handler** `function` if handler returns handler
- **transformRequest**: `[function,]` functions that transform request object and returns variable for input in getResults. Default is `req => ({ params: req.params, query: req.query })`;
- **getResponse**: `function` that take variable returned by `transformRequest` and returns a `Promise` object with response of the api
- **transformResponse**: `function` that transform the response returned by `getResults`. Default is `null`.
- **wrapResponce** `boolean` 
- **mime**: mime type string for the responce. Default is `'application/json'`.
- **endResponse**: `function`. Default is `null` for standard response.

## File structure

### services directory

In `services/` directory put .js file to define service

### routers directory

In `routers/` directory put .js file to define router instance `express.Router()`

### config directory

In `config/` directory the file

- `routes.js` define the routes;
- `server.js` define the server variable like port.

## License

[MIT](https://raw.githubusercontent.com/star-ter-js/starter-express-api/master/LICENSE)
