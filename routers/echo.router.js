//require section
const express = require('express');
const { addRoute } = require('.');

let router = express.Router();
addRoute({
  router,
  path: '/:echo',
  method: 'get',
  transformRequest: req => req.params.echo,
  getResponce: echo => [echo, ' | ', echo].join(''),
  mime: 'text/plain'
});

module.exports = router;
