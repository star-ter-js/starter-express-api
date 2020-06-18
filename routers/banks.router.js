const express = require('express');
const { addRoute } = require('.');
const geocode = require('../services/esriGeocode.service.js');

let router = express.Router();
addRoute({
  router,
  path: '/:city',
  method: 'GET',
  transformRequest: [req => `banks in ${req.params.city}`],
  getResponce: geocode,
  //transformResponce: resp => resp.candidates.map(candidate => `${candidate.address} [${candidate.extent.xmin}, ${candidate.extent.ymin}, ${candidate.extent.xmax}, ${candidate.extent.ymax}]`),
  transformResponce: [resp => resp.candidates, geoJSONFromEsriCandidates],
  wrapResponce: false,
}); // addRoute

module.exports = router;

// function definition
/**
 * geoJSONFromEsriCandidates
 *
 * @param {*} candidates candiddates responce from esri singleLine geocode
 * @returns geoJSON file
 */
function geoJSONFromEsriCandidates(candidates) {
  const features = candidates.map(candidate => {
    //console.log(candidate.location);
    const properties = {
      name: candidate.address,
      extent: [candidate.extent.xmin, candidate.extent.ymin, candidate.extent.xmax, candidate.extent.ymax]
    };
    const geometry = {
      type: 'Point',
      coordinates: [candidate.location.x, candidate.location.y]
    };

    return {
      type: 'Feature',
      properties,
      geometry
    };
  });

  return {
    type: 'FeatureCollection',
    features
  };
} // geoJSONFromEsriCandidates
