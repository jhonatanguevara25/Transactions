const express = require("express");
const cors = require("cors");
const routes = require("./transaction");
const routesBD = require("./read");
const routesOrden = require("./orders");

const app = express();
app.set("port", process.env.PORT || 5000);

// middlewares -------------------------------------
app.use(express.json());
app.use(cors());
// routes -------------------------------------------
app.get("/", (req, res) => {
  res.send("Api funcionando");
});

app.use("/api/transaccion", routes);
app.use("/api/read", routesBD);
app.use("/api/ordenes", routesOrden);

// server running -----------------------------------
app.listen(app.get("port"), () => {
  console.log("server running on port", app.get("port"));
});
