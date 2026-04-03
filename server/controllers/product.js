const Product = require("../models/product");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    req.body.slug = slugify(req.body.title);
    const newProduct = await new Product(req.body).save();
    res.json(newProduct);
  } catch (err) {
    console.log("PRODUCT CREATE ERR ----->", err);
    res.status(400).json({
      err: err.message,
    });
  }
};

exports.listAll = async (req, res) => {
  const products = await Product.find({})
    .limit(parseInt(req.params.count, 10))
    .populate("category")
    .populate("subs")
    .sort([["createdAt", "desc"]])
    .exec();

  res.json(products);
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({
      slug: req.params.slug,
    }).exec();
    res.json(deleted);
  } catch (err) {
    console.log("PRODUCT DELETE ERR ----->", err);
    res.status(400).send("Product delete failed");
  }
};

exports.read = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate("category")
    .populate("subs")
    .exec();

  res.json(product);
};

exports.update = async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }

    const updated = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    ).exec();

    res.json(updated);
  } catch (err) {
    console.log("PRODUCT UPDATE ERR ----->", err);
    res.status(400).json({
      err: err.message,
    });
  }
};

exports.list = async (req, res) => {
  try {
    const { sort, order, page } = req.body;
    const currentPage = page || 1;
    const perPage = 3;

    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate("category")
      .populate("subs")
      .sort([[sort, order]])
      .limit(perPage)
      .exec();

    res.json(products);
  } catch (err) {
    console.log("PRODUCT LIST ERR ----->", err);
    res.status(400).send("List products failed");
  }
};

exports.productsCount = async (req, res) => {
  const total = await Product.find({}).estimatedDocumentCount().exec();
  res.json(total);
};

exports.listRelated = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();

  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(3)
    .populate("category")
    .populate("subs")
    .exec();

  res.json(related);
};

const baseProductQuery = () =>
  Product.find({}).populate("category", "_id name slug").populate("subs", "_id name slug");

const handleQuery = async (res, query) => {
  const products = await Product.find({ $text: { $search: query } })
    .populate("category", "_id name slug")
    .populate("subs", "_id name slug")
    .exec();

  res.json(products);
};

const handlePrice = async (res, price) => {
  const products = await Product.find({
    price: {
      $gte: price[0],
      $lte: price[1],
    },
  })
    .populate("category", "_id name slug")
    .populate("subs", "_id name slug")
    .exec();

  res.json(products);
};

const handleCategory = async (res, category) => {
  const categoryFilter = Array.isArray(category)
    ? { $in: category }
    : category;

  const products = await Product.find({ category: categoryFilter })
    .populate("category", "_id name slug")
    .populate("subs", "_id name slug")
    .exec();

  res.json(products);
};

const handleSub = async (res, sub) => {
  const subId = typeof sub === "object" && sub !== null ? sub._id : sub;

  const products = await Product.find({ subs: subId })
    .populate("category", "_id name slug")
    .populate("subs", "_id name slug")
    .exec();

  res.json(products);
};

const handleShipping = async (res, shipping) => {
  const products = await Product.find({ shipping })
    .populate("category", "_id name slug")
    .populate("subs", "_id name slug")
    .exec();

  res.json(products);
};

const handleColor = async (res, color) => {
  const products = await Product.find({ color })
    .populate("category", "_id name slug")
    .populate("subs", "_id name slug")
    .exec();

  res.json(products);
};

const handleBrand = async (res, brand) => {
  const products = await Product.find({ brand })
    .populate("category", "_id name slug")
    .populate("subs", "_id name slug")
    .exec();

  res.json(products);
};

exports.searchFilters = async (req, res) => {
  const { query, price, category, sub, shipping, color, brand } = req.body;

  if (query) {
    return handleQuery(res, query);
  }

  if (price !== undefined) {
    return handlePrice(res, price);
  }

  if (category && (!Array.isArray(category) || category.length)) {
    return handleCategory(res, category);
  }

  if (sub) {
    return handleSub(res, sub);
  }

  if (shipping) {
    return handleShipping(res, shipping);
  }

  if (color) {
    return handleColor(res, color);
  }

  if (brand) {
    return handleBrand(res, brand);
  }

  const products = await baseProductQuery().limit(12).exec();
  return res.json(products);
};
