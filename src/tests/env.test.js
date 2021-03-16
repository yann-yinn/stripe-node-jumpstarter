require("dotenv").config();

test("All required env vars should be defined", () => {
  expect(process.env.MONGO_URL).toBeTruthy();
  expect(process.env.PORT).toBeTruthy();
  expect(process.env.JWT_SECRET).toBeTruthy();
  expect(process.env.STRIPE_SECRET_KEY).toBeTruthy();
  expect(process.env.STRIPE_SITE_URL).toBeTruthy();
  expect(process.env.STRIPE_WEBHOOK_SECRET).toBeTruthy();
  expect(process.env.STRIPE_PRICES_IDS).toBeTruthy();
});
