// { path, express Router Instance file }
const routes = {
  '/echo': 'echo.router',
  '/sql': 'sql.router',
  '/geocode': 'esriGeocode.router',
  '/banks?': 'banks.router',
  '/weather': 'weather.router',
}; // routes

module.exports = routes;
