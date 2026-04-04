const Product = require("../models/product");
const User = require("../models/user");
const Review = require("../models/review");
const Wishlist = require("../models/wishlist");
const slugify = require("slugify");

const syncProductRatings = async (productId) => {
  const reviews = await Review.find({ product: productId }).select(
    "star postedBy comment"
  );

  const ratings = reviews.map((review) => ({
    star: review.star,
    postedBy: review.postedBy,
    comment: review.comment,
  }));

  await Product.findByIdAndUpdate(productId, { ratings }).exec();

  return reviews;
};

exports.create = async (req, res) => {
  try {
    console.log(req.body);
    req.body.slug = slugify(req.body.title);
    const newProduct = await new Product(req.body).save();
    res.json(newProduct);
  } catch (err) {
    console.log(err);
    // res.status(400).send("Create product failed");
    res.status(400).json({
      err: err.message,
    });
  }
};

exports.listAll = async (req, res) => {
  let products = await Product.find({})
    .limit(parseInt(req.params.count))
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

    if (deleted) {
      await Review.deleteMany({ product: deleted._id }).exec();
      await Wishlist.updateMany(
        {},
        { $pull: { products: deleted._id } }
      ).exec();
      await User.updateMany({}, { $pull: { wishlist: deleted._id } }).exec();
    }

    res.json(deleted);
  } catch (err) {
    console.log(err);
    return res.staus(400).send("Product delete failed");
  }
};

exports.read = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate("category")
    .populate("subs")
    .exec();

  const reviews = await Review.find({ product: product._id })
    .populate("postedBy", "_id name email")
    .sort([["createdAt", "desc"]])
    .exec();

  res.json({
    ...product.toObject(),
    reviews,
  });
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
    console.log("PRODUCT UPDATE ERROR ----> ", err);
    // return res.status(400).send("Product update failed");
    res.status(400).json({
      err: err.message,
    });
  }
};

// WITHOUT PAGINATION
// exports.list = async (req, res) => {
//   try {
//     // createdAt/updatedAt, desc/asc, 3
//     const { sort, order, limit } = req.body;
//     const products = await Product.find({})
//       .populate("category")
//       .populate("subs")
//       .sort([[sort, order]])
//       .limit(limit)
//       .exec();

//     res.json(products);
//   } catch (err) {
//     console.log(err);
//   }
// };

// WITH PAGINATION
exports.list = async (req, res) => {
  // console.table(req.body);
  try {
    // createdAt/updatedAt, desc/asc, 3
    const { sort, order, page } = req.body;
    const currentPage = page || 1;
    const perPage = 3; // 3

    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate("category")
      .populate("subs")
      .sort([[sort, order]])
      .limit(perPage)
      .exec();

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

exports.productsCount = async (req, res) => {
  let total = await Product.find({}).estimatedDocumentCount().exec();
  res.json(total);
};

exports.productStar = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();
  const { star, comment } = req.body;

  const review = await Review.findOneAndUpdate(
    {
      product: req.params.productId,
      postedBy: user._id,
    },
    {
      star,
      comment: comment || "",
      product: req.params.productId,
      postedBy: user._id,
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  ).exec();

  await syncProductRatings(req.params.productId);

  res.json(review);
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

// SERACH / FILTER

const handleQuery = async (req, res, query) => {
  const products = await Product.find({ $text: { $search: query } })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .exec();

  res.json(products);
};

const handlePrice = async (req, res, price) => {
  try {
    let products = await Product.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      },
    })
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .exec();

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

const handleCategory = async (req, res, category) => {
  try {
    let products = await Product.find({ category })
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .exec();

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

const handleStar = async (req, res, stars) => {
  const aggregates = await Product.aggregate([
    {
      $project: {
        document: "$$ROOT",
        // title: "$title",
        floorAverage: {
          $floor: { $avg: "$ratings.star" }, // floor value of 3.33 will be 3
        },
      },
    },
    { $match: { floorAverage: stars } },
  ])
    .limit(12);

  const products = await Product.find({ _id: aggregates })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .exec();

  res.json(products);
};

const handleSub = async (req, res, sub) => {
  const products = await Product.find({ subs: sub })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .exec();

  res.json(products);
};

const handleShipping = async (req, res, shipping) => {
  const products = await Product.find({ shipping })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .exec();

  res.json(products);
};

const handleColor = async (req, res, color) => {
  const products = await Product.find({ color })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .exec();

  res.json(products);
};

const handleBrand = async (req, res, brand) => {
  const products = await Product.find({ brand })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .exec();

  res.json(products);
};

exports.searchFilters = async (req, res) => {
  const {
    query,
    price,
    category,
    stars,
    sub,
    shipping,
    color,
    brand,
  } = req.body;

  if (query) {
    console.log("query --->", query);
    return handleQuery(req, res, query);
  }

  // price [20, 200]
  if (price !== undefined) {
    console.log("price ---> ", price);
    return handlePrice(req, res, price);
  }

  if (category) {
    console.log("category ---> ", category);
    return handleCategory(req, res, category);
  }

  if (stars) {
    console.log("stars ---> ", stars);
    return handleStar(req, res, stars);
  }

  if (sub) {
    console.log("sub ---> ", sub);
    return handleSub(req, res, sub);
  }

  if (shipping) {
    console.log("shipping ---> ", shipping);
    return handleShipping(req, res, shipping);
  }

  if (color) {
    console.log("color ---> ", color);
    return handleColor(req, res, color);
  }

  if (brand) {
    console.log("brand ---> ", brand);
    return handleBrand(req, res, brand);
  }

  return res.json([]);
};
