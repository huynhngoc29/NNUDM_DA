const Role = require("../models/role");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    res.json(await new Role({ name, slug: slugify(name) }).save());
  } catch (err) {
    console.log("ROLE CREATE ERR ----->", err);
    res.status(400).send("Create role failed");
  }
};

exports.list = async (req, res) =>
  res.json(await Role.find({}).sort({ createdAt: -1 }).exec());

exports.read = async (req, res) => {
  const role = await Role.findOne({ slug: req.params.slug }).exec();
  res.json(role);
};

exports.update = async (req, res) => {
  const { name } = req.body;
  try {
    const updated = await Role.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name) },
      { new: true }
    ).exec();
    res.json(updated);
  } catch (err) {
    console.log("ROLE UPDATE ERR ----->", err);
    res.status(400).send("Role update failed");
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Role.findOneAndDelete({ slug: req.params.slug }).exec();
    res.json(deleted);
  } catch (err) {
    console.log("ROLE DELETE ERR ----->", err);
    res.status(400).send("Role delete failed");
  }
};
