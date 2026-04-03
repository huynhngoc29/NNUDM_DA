const Order = require("../models/order");
const User = require("../models/user");
const Role = require("../models/role");

exports.orders = async (req, res) => {
  let allOrders = await Order.find({})
    .sort("-createdAt")
    .populate("products.product")
    .exec();

  res.json(allOrders);
};

exports.orderStatus = async (req, res) => {
  // console.log(req.body);
  // return;
  const { orderId, orderStatus } = req.body;

  let updated = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus },
    { new: true }
  ).exec();

  res.json(updated);
};

exports.getUsers = async (req, res) => {
  const users = await User.find({})
    .populate("roleRef")
    .sort({ createdAt: -1 })
    .exec();

  const normalizedUsers = users.map((user) => {
    const currentRole =
      (user.roleRef && user.roleRef.slug) || user.role || "subscriber";

    return {
      ...user.toObject(),
      role: currentRole,
    };
  });

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

  res.json(updatedUser);
};
