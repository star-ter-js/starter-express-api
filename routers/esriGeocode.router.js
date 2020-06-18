const express = require('express');
const { addRoute } = require('.');
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
