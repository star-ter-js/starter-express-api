module.exports = {
  makeMiddleware,
  addRoutesFromMiddleware,
  addRoute,
  addRoutes,
  addRoutersInApp,
};

// function definition
function addRoutes(opts, router) {
  opts.forEach(opt => {
    addRoute({
      router,
      ...opt
    });
  });
} // addRoutes

/**
 * add a route in express Router
 *
 * @param {Object} {
 *   router = express Router express.Router(),
 *   {string} method default 'get',
 *   {string} path default '/',
 *   {function} handler express funciotn middleware; default null
 *   {function} | [{function}] transformRequest return an input for getResponce
 *              from req object; default req => {params: req.params, query: req.query},
 *   {function} getResponce async function that return a promise for retriving
 *              the responce; default input => Promise.resolve(input),
 *   {function} | [{function}] transformResponce default [],
 *   {boolean} wrapResponce default true
 *   {string} mime default 'application/json',
 *   {function} endResponce default null (res, out) => {},
 * }
 *
 * @returns undefined bat set ro
 */
function addRoute({
  router = undefined,
  method = 'get',
  path = '/',
  handler = null,
  transformRequest = req => ({
    params: req.params,
    query: req.query
  }),
  getResponce = input => Promise.resolve(input),
  transformResponce = [],
  wrapResponce = true,
  mime = 'application/json',
  endResponce = null,
}) {
  if (router === undefined || router === null) throw new Error('"router" is required');

  method = method.toLowerCase();

  router[method](path, makeMiddleware({
    handler,
    transformRequest,
    getResponce,
    transformResponce,
    wrapResponce,
    mime,
    endResponce
  }));

} // addRoute

/**
 * make an expres middleware (req, res, next) => {}
 *
 * @param {object} {
 *   {function} handler express funciotn middleware; default null
 *   {function} | [{function}] transformRequest return an input for getResponce
 *              from req object; default req => {params: req.params, query: req.query},
 *   {function} getResponce async function that return a promise for retriving
 *              the responce; default input => Promise.resolve(input),
 *   {function} | [{function}] transformResponce default [],
 *   {boolean} wrapResponce default true
 *   {boolean} wrapZeroResults default false
 *   {string} mime default 'application/json',
 *   {function} endResponce default null,
 * }
 * @returns express middleware like as async (req, res) => {}
 */
function makeMiddleware({
  transformRequest = req => ({
    params: req.params,
    query: req.query
  }),
  getResponce = input => Promise.resolve(input),
  transformResponce = [],
  wrapZeroResults = false,
  wrapResponce = true,
  mime = 'application/json',
  endResponce = null,
}) {

  return (async (req, res) => {

    let inputService;
    if (!Array.isArray(transformRequest)) transformRequest = [transformRequest];
    transformRequest.forEach(fn => (inputService = (fn && 'function' === typeof fn) ? fn(req) : req));
    //console.log(inputService);

    try {
      let resp = await getResponce(inputService);

      if (wrapZeroResults)
        if (resp === undefined || resp === null || resp == '') {
          return res.json({
            status: 'ZERO_RESULTS',
            results: []
          });
        }

      let out = resp;
      if (!Array.isArray(transformResponce)) transformResponce = [transformResponce];
      transformResponce.forEach(fn => (out = (fn && 'function' === typeof fn) ? fn(out) : out));

      if (endResponce && 'function' === typeof endResponce) return endResponce(res, out);

      switch (mime) {
        case 'text/plain':
        case 'plain':
        case 'text':
          if ('string' !== typeof out) out = JSON.stringify(out);
          res.set('Content-Type', 'text/plain').set('charset', 'utf-8');
          res.send(out);
          break;
        case 'html':
        case 'text/html':
          res.send(out);
          break;
        case 'application/json':
        case 'json':
        default:
          if (wrapResponce) {
            let newOut = {
              status: 'OK',
              results: out,
            }
            if (Array.isArray(out)) newOut.items = out.length;
            res.json(newOut);
          } else res.json(out);
          break;
      } // switch
    } catch (err) {
      res.json({
        status: 'ERROR',
        error: err.message || err
      });
    } // try

  });

} // makeMiddleware

/*
const routes = {
  ...
  '/echo': 'echo.router',
  ...
};
 */
/**
 * add already written router in express app (const app = Express())
 *
 * @param {Express()} app instance of Express
 */
function addRoutersInApp(routes, app) {
  Object.entries(routes).forEach(([path, routerFileName]) => {
    app.use(path, require(`./${routerFileName}`));
  });
} // addRoutersInApp

function addRoutesFromMiddleware(routes, router) {
  routes.forEach(route => {
    if (Array.isArray(route)) var [method, path, handler] = route;
    else var {
      method,
      path,
      handler
    } = route; // if

    if (!method || !path) return;

    handler = handler || ((req, res, next) => {
      res.send(`handler not yet implemented for "${method.toUpperCase()}" "${path}"`);
    })

    router[method](path, handler);
  }); // forEach
} // addRoutesFromMiddleware
