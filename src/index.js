const bootstrap = require("./utils/bootstrap");
ObjectId = require("mongodb").ObjectID;

bootstrap().then(({ app }) => {
  // ajouter nos routes stripes
  app.use(require("./stripe/routes"));

  app.get("/userinfo", async (req, res) => {
    const user = await db()
      .collection("users")
      .findOne({ _id: ObjectId(req.user.id) });
    res.send({ user: user });
  });

  app.listen(process.env.PORT, () => {
    console.log(`server app listening on port ${process.env.PORT}!`);
  });
});
