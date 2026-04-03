const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const { readdirSync } = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI || process.env.DB_URI;
const modelsPath = path.join(__dirname, "models");
const routesPath = path.join(__dirname, "routes");

const loadModels = () =>
  readdirSync(modelsPath)
    .filter((file) => file.endsWith(".js"))
    .forEach((file) => require(path.join(modelsPath, file)));

const loadRoutes = () =>
  readdirSync(routesPath)
    .filter((file) => file.endsWith(".js"))
    .forEach((file) => app.use("/api", require(path.join(routesPath, file))));

const seedDefaultRoles = async () => {
  const Role = mongoose.model("Role");
  const defaultRoles = [
    { name: "subscriber", slug: "subscriber" },
    { name: "admin", slug: "admin" },
  ];

  for (const role of defaultRoles) {
    const existingRole = await Role.findOne({ slug: role.slug }).exec();

    if (!existingRole) {
      await new Role(role).save();
    }
  }
};

app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());

const startServer = async () => {
  if (!mongoUri) {
    console.log("Missing MONGODB_URI (or DB_URI) in environment variables");
    return;
  }

  try {
    loadModels();
    loadRoutes();

    await mongoose.connect(mongoUri);
    await seedDefaultRoles();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log("Server start error", error);
  }
};

startServer();
