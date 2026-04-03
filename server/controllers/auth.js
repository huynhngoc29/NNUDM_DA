const User = require("../models/user");
const Role = require("../models/role");

const findOrCreateRole = async (roleName) => {
  const slug = roleName.toLowerCase();
  let role = await Role.findOne({ slug }).exec();

  if (!role) {
    role = await new Role({
      name: roleName,
      slug,
    }).save();
  }

  return role;
};

const normalizeUserRole = async (userDoc) => {
  if (!userDoc) {
    return userDoc;
  }

  let resolvedRole = userDoc.role || "subscriber";
  let roleRef = userDoc.roleRef;

  if (roleRef && roleRef.slug) {
    resolvedRole = roleRef.slug;
  } else {
    const fallbackRole = await findOrCreateRole(resolvedRole);
    roleRef = fallbackRole;

    await User.findByIdAndUpdate(userDoc._id, {
      role: fallbackRole.slug,
      roleRef: fallbackRole._id,
    }).exec();
  }

  const normalizedUser = userDoc.toObject ? userDoc.toObject() : userDoc;

  return {
    ...normalizedUser,
    role: resolvedRole,
    roleRef,
  };
};

exports.createOrUpdateUser = async (req, res) => {
  const { picture, email } = req.user;
  const subscriberRole = await findOrCreateRole("subscriber");

  let user = await User.findOneAndUpdate(
    { email },
    {
      name: email.split("@")[0],
      picture,
      role: subscriberRole.slug,
      roleRef: subscriberRole._id,
    },
    { new: true }
  ).exec();

  if (user) {
    return res.json(await normalizeUserRole(user));
  }

  const newUser = await new User({
    email,
    name: email.split("@")[0],
    picture,
    role: subscriberRole.slug,
    roleRef: subscriberRole._id,
  }).save();

  res.json(await normalizeUserRole(newUser));
};

exports.currentUser = async (req, res) => {
  const currentUser = await User.findOne({ email: req.user.email })
    .populate("roleRef")
    .exec();

  res.json(await normalizeUserRole(currentUser));
};

exports.normalizeUserRole = normalizeUserRole;
