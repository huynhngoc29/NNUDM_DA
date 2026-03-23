import db from "../models/index.js";

export const getAllProducts = async (req, res) => {
  const { keyword } = req.query;
  try {
    let whereClause = {};
    if (keyword && keyword.trim() !== "") {
      whereClause = {
        [Op.or]: [
          { product_name: { [Op.like]: `%${keyword}%` } },
          { description: { [Op.like]: `%${keyword}%` } },
        ],
      };
    }
    const products = await db.Product.findAll({
      where: whereClause,
      include: [
        {
          model: db.Category,
          attributes: ["category_name"],
        },
        {
          model: db.SubCategory,
          attributes: ["subcategory_name"],
        },
        {
          model: db.ProductImage,
          attributes: ["image_id", "image_url", "alt_text", "is_main"],
        },
      ],
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Loi khi lay san pham",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await db.Product.findByPk(id, {
      include: [
        {
          model: db.Category,
          attributes: ["category_name"],
        },
        {
          model: db.SubCategory,
          attributes: ["subcategory_name"],
        },
        {
          model: db.ProductImage,
          attributes: ["image_id", "image_url", "alt_text", "is_main"],
        },
      ],
    });
    if (!product) {
      return res.status(404).json({ message: "San pham khong ton tai" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Loi khi lay thong tin san pham",
      error: error.message,
    });
  }
};
export const getProductBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const product = await db.Product.findOne({
      where: { slug },
      include: [
        {
          model: db.Category,
          attributes: ["category_name"],
        },
        {
          model: db.SubCategory,
          attributes: ["subcategory_name"],
        },
        {
          model: db.ProductImage,
          attributes: ["image_id", "image_url", "alt_text", "is_main"],
        },
      ],
    });
    if (!product) {
      return res.status(404).json({ message: "San pham khong ton tai" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Loi khi lay thong tin san pham",
      error: error.message,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      product_name,
      description,
      price,
      quanlity,
      category_id,
      subcategory_id,
    } = req.body;
    const imageFiles = req.files;
    const slug = slugify(product_name, {
      lower: true,
      locale: "vi",
      strict: true,
    });
    const newProduct = await db.Product.create({
      product_name,
      slug,
      description,
      price,
      quantity,
      category_id,
      subcategory_id,
    });

    if (imageFiles && imageFiles.length > 0) {
      const imagesToCreate = imageFiles.map((file, index) => ({
        product_id: newProduct.product_id,
        image_url: file.path,
        alt_text: product_name,
        is_main: index === 0,
      }));
      await db.ProductImage.bulkCreate(imagesToCreate);
    }

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi tạo sản phẩm",
      error: error.message,
    });
  }
};
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    product_name,
    description,
    price,
    quantity,
    category_id,
    subcategory_id,
    is_active,
    existingImageIds,
  } = req.body;

  let existingImageIdsParsed = [];
  if (existingImageIds) {
    try {
      existingImageIdsParsed = JSON.parse(existingImageIds);
    } catch (e) {
      return res
        .status(400)
        .json({ message: "existingImageIds không đúng định dạng JSON" });
    }
  }

  try {
    const product = await db.Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tìm thấy" });
    }

    // Cập nhật thông tin sản phẩm
    if (product_name) {
      product.product_name = product_name;
      product.slug = slugify(product_name, {
        lower: true,
        locale: "vi",
        strict: true,
      });
    }
    product.description = description || product.description;
    product.price = price || product.price;
    product.quantity = quantity || product.quantity;
    product.category_id = category_id || product.category_id;
    product.subcategory_id = subcategory_id || product.subcategory_id;

    if (typeof is_active !== "undefined") {
      product.is_active = is_active;
    }

    // Lấy danh sách ảnh hiện có
    const currentImages = await db.ProductImage.findAll({
      where: { product_id: id },
    });

    // Xác định ảnh cần xóa (không có trong danh sách giữ lại)
    const imagesToDelete = currentImages.filter(
      (img) => !existingImageIdsParsed.includes(img.image_id),
    );

    // Xóa ảnh không giữ lại
    await Promise.all(imagesToDelete.map((img) => img.destroy()));

    // Thêm ảnh mới nếu có
    const imageFiles = req.files;
    if (imageFiles && imageFiles.length > 0) {
      // Xem có ảnh chính chưa, nếu không có thì ảnh đầu tiên mới upload sẽ là ảnh chính
      const hasMainImage = await db.ProductImage.findOne({
        where: { product_id: id, is_main: true },
      });
      const imagesToCreate = imageFiles.map((file, index) => ({
        product_id: id,
        image_url: file.path,
        alt_text: product_name,
        is_main: hasMainImage ? false : index === 0,
      }));
      await db.ProductImage.bulkCreate(imagesToCreate);
    }

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật sản phẩm",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await db.Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tìm thấy" });
    }
    await product.destroy();
    res.status(200).json({ message: "Sản phẩm đã được xóa" });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi xóa sản phẩm",
      error: error.message,
    });
  }
};

export const getSimilarProducts = async (req, res) => {
  const { category_id, subcategory_id } = req.query;
  try {
    const products = await db.Product.findAll({
      where: {
        category_id,
        subcategory_id,
      },
      include: [
        {
          model: db.Category,
          attributes: ["category_name"],
        },
        {
          model: db.SubCategory,
          attributes: ["subcategory_name"],
        },
        {
          model: db.ProductImage,
          attributes: ["image_id", "image_url", "alt_text", "is_main"],
        },
      ],
    });

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm tương tự" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm tương tự:", error);
    res.status(500).json({
      message: "Lỗi khi lấy sản phẩm tương tự",
      error: error.message,
    });
  }
};

export const getCategoryesWithSubCategories = async (req, res) => {
  try {
    const categories = await db.Category.findAll({
      include: [
        {
          model: db.SubCategory,
          attributes: ["subcategory_id", "subcategory_name"],
        },
      ],
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh mục và danh mục con",
      error: error.message,
    });
  }
};
export const filterProducts = async (req, res) => {
  try {
    const {
      keyword,
      category_id,
      subcategory_id,
      is_active,
      dateType,
      startDate,
      endDate,
    } = req.query;
    const whereClause = {};
    if (keyword && keyword.trim() !== "") {
      whereClause[Op.or] = [
        { product_name: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } },
      ];
    }
    if (category_id) {
      const catIds = category_id.split(",").map((id) => Number(id.trim()));
      whereClause.category_id = { [Op.in]: catIds };
    }

    if (subcategory_id) {
      const subIds = subcategory_id.split(",").map((id) => Number(id.trim()));
      whereClause.subcategory_id = { [Op.in]: subIds };
    }

    if (
      typeof is_active !== "undefined" &&
      is_active !== null &&
      is_active !== ""
    ) {
      // is_active truyền string "true" hoặc "false"
      whereClause.is_active = is_active === "true";
    }

    if (dateType && (dateType === "created_at" || dateType === "updated_at")) {
      if (startDate && endDate) {
        whereClause[dateType] = {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        };
      } else if (startDate) {
        whereClause[dateType] = {
          [Op.gte]: new Date(startDate),
        };
      } else if (endDate) {
        whereClause[dateType] = {
          [Op.lte]: new Date(endDate),
        };
      }
    }

    const products = await db.Product.findAll({
      where: whereClause,
      include: [
        {
          model: db.Category,
          attributes: ["category_name"],
        },
        {
          model: db.SubCategory,
          attributes: ["subcategory_name"],
        },
        {
          model: db.ProductImage,
          attributes: ["image_id", "image_url", "alt_text", "is_main"],
        },
      ],
    });

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Lỗi khi lọc sản phẩm",
      error: error.message,
    });
  }
};
