//require section
const express = require('express');
const { addRoute } = require('.');
const executeSQL = require('../services/sql.service.js');

let router = express.Router();
addRoute({
  router,
  path: '/:sql',
  transformRequest: req => req.params.sql,
  getResponce: executeSQL,
});

module.exports = router;
