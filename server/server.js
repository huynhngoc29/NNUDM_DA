const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const { readdirSync } = require("fs");
const path = require("path");
require("dotenv").config();

// app
const app = express();
const mongoUri = process.env.MONGODB_URI || process.env.DB_URI;
const modelsPath = path.join(__dirname, "models");

const loadModels = () =>
  readdirSync(modelsPath)
    .filter((file) => file.endsWith(".js"))
    .forEach((file) => require(path.join(modelsPath, file)));

const ensureCollections = async () => {
  const modelNames = mongoose.modelNames();

  for (const modelName of modelNames) {
    const model = mongoose.model(modelName);

    try {
      await model.createCollection();
    } catch (err) {
      // MongoDB returns NamespaceExists if the collection is already present.
      if (err.codeName !== "NamespaceExists") {
        throw err;
      }
    }

    await model.syncIndexes();
  }
};

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

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());

// routes middleware
readdirSync("./routes").map((r) => app.use("/api", require("./routes/" + r)));

// port
const port = process.env.PORT || 5000;

const startServer = async () => {
  if (!mongoUri) {
    console.log(
      "DB CONNECTION ERR Missing MONGODB_URI (or DB_URI) in environment variables"
    );
    return;
  }

  try {
    loadModels();
    await mongoose.connect(mongoUri);
    console.log("DB CONNECTED");

    await ensureCollections();
    console.log("DB COLLECTIONS READY");

    await seedDefaultRoles();
    console.log("DEFAULT ROLES READY");

    app.listen(port, () => console.log(`Server is running on port ${port}`));
  } catch (err) {
    console.log("DB CONNECTION ERR", err);
  }
};

startServer();
