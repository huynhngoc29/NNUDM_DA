const admin = require("../firebase");
const User = require("../models/user");

exports.authCheck = async (req, res, next) => {
  try {
    if (!admin.apps.length) {
      return res.status(500).json({
        err: "Firebase admin is not configured",
      });
    }

    const firebaseUser = await admin
      .auth()
      .verifyIdToken(req.headers.authtoken);

    req.user = firebaseUser;
    next();
  } catch (err) {
    res.status(401).json({
      err: "Invalid or expired token",
    });
  }
};

exports.adminCheck = async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email }).populate("roleRef").exec();

  if (!adminUser) {
    return res.status(404).json({ err: "User not found" });
  }

  const userRole =
    (adminUser.roleRef && adminUser.roleRef.slug) || adminUser.role;

  if (userRole !== "admin") {
    return res.status(403).json({
      err: "Admin resource. Access denied.",
    });
  }

  next();
};
