const { init } = require("../utils/app");

let routes;

beforeAll(async () => {
  routes = await getDefinedRoutes();
});

// https://stackoverflow.com/questions/14934452/how-to-get-all-registered-routes-in-express/28199817#28199817
async function getDefinedRoutes() {
  var route,
    routes = [];
  const app = await init();
  app.use(require("../stripe/stripe.routes"));
  app.use(require("../routes"));
  app._router.stack.forEach(function (middleware) {
    if (middleware.route) {
      // routes registered directly on the app
      routes.push(middleware.route);
    } else if (middleware.name === "router") {
      // router middleware
      middleware.handle.stack.forEach(function (handler) {
        route = handler.route;
        route && routes.push(route);
      });
    }
  });
  return routes;
}

test("/api/stripe/plans", async () => {
  let route = null;
  route = routes.find((route) => route.path === "/api/stripe/plans");
  expect(route).toBeTruthy();
  expect(route.methods.get).toBe(true);
});

test("/api/stripe/create-checkout-session", async () => {
  let route = null;
  route = routes.find(
    (route) => route.path === "/api/stripe/create-checkout-session"
  );
  expect(route).toBeTruthy();
  expect(route.methods.post).toBe(true);
});

test("/api/stripe/create-customer-portal-session", async () => {
  let route = null;
  route = routes.find(
    (route) => route.path === "/api/stripe/create-customer-portal-session"
  );
  expect(route).toBeTruthy();
  expect(route.methods.post).toBe(true);
});

test("/api/stripe/webhooks", async () => {
  let route = null;
  route = routes.find((route) => route.path === "/api/stripe/webhooks");
  expect(route).toBeTruthy();
  expect(route.methods.post).toBe(true);
});

test("/api/userinfo", async () => {
  let route = null;
  route = routes.find((route) => route.path === "/api/userinfo");
  expect(route).toBeTruthy();
  expect(route.methods.get).toBe(true);
});
