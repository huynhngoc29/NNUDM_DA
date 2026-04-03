import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import AdminNav from "../../../components/nav/AdminNav";
import ProductCreateForm from "../../../components/forms/ProductCreateForm";
import { getCategories, getCategorySubs } from "../../../functions/category";
import { createProduct } from "../../../functions/product";

const initialState = {
  title: "",
  description: "",
  price: "",
  categories: [],
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

const ProductCreate = () => {
  const [values, setValues] = useState(initialState);
  const [subOptions, setSubOptions] = useState([]);
  const [showSub, setShowSub] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () =>
    getCategories().then((response) =>
      setValues((prev) => ({ ...prev, categories: response.data }))
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...values,
      price: Number(values.price),
      quantity: Number(values.quantity),
      images: values.imageUrl
        ? [{ public_id: values.imageUrl, url: values.imageUrl }]
        : [],
    };

    delete payload.categories;
    delete payload.colors;
    delete payload.brands;
    delete payload.imageUrl;

    createProduct(payload, user.token)
      .then((response) => {
        toast.success(`"${response.data.title}" is created`);
        setValues((prev) => ({
          ...initialState,
          categories: prev.categories,
        }));
        setSubOptions([]);
        setShowSub(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response?.data?.err || "Create product failed");
      });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    const nextCategory = e.target.value;
    setValues({ ...values, subs: [], category: nextCategory });
    getCategorySubs(nextCategory).then((response) => {
      setSubOptions(response.data);
    });
    setShowSub(true);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          <h4>Product create</h4>
          <hr />
          <ProductCreateForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            setValues={setValues}
            values={values}
            handleCategoryChange={handleCategoryChange}
            subOptions={subOptions}
            showSub={showSub}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCreate;
