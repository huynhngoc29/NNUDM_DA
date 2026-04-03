import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import AdminNav from "../../../components/nav/AdminNav";
import ProductUpdateForm from "../../../components/forms/ProductUpdateForm";
import { getCategories, getCategorySubs } from "../../../functions/category";
import { getProduct, updateProduct } from "../../../functions/product";

const initialState = {
  title: "",
  description: "",
  price: "",
  category: "",
  subs: [],
  shipping: "",
  quantity: "",
  images: [],
  imageUrl: "",
  colors: ["Black", "Brown", "Silver", "White", "Blue"],
  brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"],
  color: "",
  brand: "",
};

const ProductUpdate = ({ match, history }) => {
  const [values, setValues] = useState(initialState);
  const [categories, setCategories] = useState([]);
  const [subOptions, setSubOptions] = useState([]);
  const [arrayOfSubs, setArrayOfSubs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const { user } = useSelector((state) => ({ ...state }));
  const { slug } = match.params;

  useEffect(() => {
    loadProduct();
    loadCategories();
  }, []);

  const loadProduct = () => {
    getProduct(slug).then((response) => {
      const product = response.data;
      setValues((prev) => ({
        ...prev,
        ...product,
        imageUrl:
          product.images && product.images.length ? product.images[0].url : "",
      }));

      getCategorySubs(product.category._id).then((subResponse) => {
        setSubOptions(subResponse.data);
      });

      setArrayOfSubs(product.subs.map((sub) => sub._id));
    });
  };

  const loadCategories = () =>
    getCategories().then((response) => setCategories(response.data));

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...values,
      subs: arrayOfSubs,
      category: selectedCategory ? selectedCategory : values.category._id,
      price: Number(values.price),
      quantity: Number(values.quantity),
      images: values.imageUrl
        ? [{ public_id: values.imageUrl, url: values.imageUrl }]
        : [],
    };

    delete payload.colors;
    delete payload.brands;
    delete payload.imageUrl;

    updateProduct(slug, payload, user.token)
      .then((response) => {
        toast.success(`"${response.data.title}" is updated`);
        history.push("/admin/products");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response?.data?.err || "Update product failed");
      });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    const nextCategory = e.target.value;
    setValues({ ...values, subs: [] });
    setSelectedCategory(nextCategory);

    getCategorySubs(nextCategory).then((response) => {
      setSubOptions(response.data);
    });

    if (values.category && values.category._id === nextCategory) {
      loadProduct();
    }

    setArrayOfSubs([]);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          <h4>Product update</h4>
          <ProductUpdateForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            values={values}
            handleCategoryChange={handleCategoryChange}
            categories={categories}
            subOptions={subOptions}
            arrayOfSubs={arrayOfSubs}
            setArrayOfSubs={setArrayOfSubs}
            selectedCategory={selectedCategory}
          />
          <hr />
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;
