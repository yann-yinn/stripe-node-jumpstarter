/**
 * @param {Object} app - express app
 * @param {String} path - path to directory: example: "front/dist"
 */
module.exports = (app, path) => {
  app.use(express.static(path));

  // This route deals enables HTML5Mode by forwarding "missing" links to the index.html
  app.all("/**", function (req, res) {
    req.url = "index.html";
    app.handle(req, res);
  });
};
