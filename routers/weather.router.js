const express = require('express');
const { addRoutes } = require('.');
const owm = require('../services/weather.service');

const router = express.Router();

addRoutes([{
  path: '/all',
  transformRequest: req => req.query.city,
  getResponce: owm.weather,
  transformResponce: [owm.stringFromWeather, resp=>resp.replace(/\n/g, '<br/>')],
  wrapResponce: false,
  mime: 'text/html',
}, {
  path: '/pressure',
  transformRequest: req => req.query.city,
  getResponce: owm.weather,
  transformResponce: resp => resp.main.pressure,
  wrapResponce: false,
}, {
  path: ['/um', '/hum', '/humidity'],
  transformRequest: req => req.query.city,
  getResponce: owm.weather,
  transformResponce: resp => resp.main.humidity,
  wrapResponce: false,
}, {
  path: ['/temp', 'temperature'],
  transformRequest: req => req.query.city,
  getResponce: owm.weather,
  transformResponce: resp => resp.main.temp,
  wrapResponce: false,
}, {
  path: '/',
  transformRequest: req => req.query.city,
  getResponce: owm.weather,
}, {
  path: '/rain',
  method: 'GET',
  getResponce: input => Promise.resolve('"weather/rain" api not yet implemented'),
  wrapResponce: false,
  mime: 'text',
}, {
  path: '/today',
  method: 'GET',
  getResponce: input => '"weather/today" api not yet implemented',
  wrapResponce: false,
  mime: 'text',
}], router);

module.exports = router;
