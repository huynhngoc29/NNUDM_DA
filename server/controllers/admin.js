const User = require("../models/user");
const Role = require("../models/role");
const { normalizeUserRole } = require("./auth");

exports.getUsers = async (req, res) => {
  const users = await User.find({})
    .populate("roleRef")
    .sort({ createdAt: -1 })
    .exec();

  const normalizedUsers = await Promise.all(
    users.map(async (user) => normalizeUserRole(user))
  );

  res.json(normalizedUsers);
};

exports.updateUserRole = async (req, res) => {
  const { userId, roleId } = req.body;
  const role = await Role.findById(roleId).exec();

  if (!role) {
    return res.status(400).send("Role not found");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      role: role.slug,
      roleRef: role._id,
    },
    { new: true }
  )
    .populate("roleRef")
    .exec();

  res.json(await normalizeUserRole(updatedUser));
};
