/**
 * @param  {object} opt default {}
 * @returns
 */
function sqlService (opt = {}) {
  return new Promise((resolve, reject) => {

    resolve([`database output from sql: '${JSON.stringify(opt).replace(/^"|"$/g, '')}'`]);
  });
} // sqlService

module.exports = sqlService;
