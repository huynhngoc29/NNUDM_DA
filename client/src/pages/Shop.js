import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, Menu, Radio, Slider } from "antd";
import { DollarOutlined, DownSquareOutlined } from "@ant-design/icons";
import ProductCard from "../components/cards/ProductCard";
import { getCategories } from "../functions/category";
import {
  fetchProductsByFilter,
  getProductsByCount,
} from "../functions/product";
import { getSubs } from "../functions/sub";

const { SubMenu } = Menu;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState([0, 0]);
  const [ok, setOk] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [subs, setSubs] = useState([]);
  const [sub, setSub] = useState("");
  const [brands, setBrands] = useState([
    "Apple",
    "Samsung",
    "Microsoft",
    "Lenovo",
    "ASUS",
  ]);
  const [brand, setBrand] = useState("");
  const [colors, setColors] = useState([
    "Black",
    "Brown",
    "Silver",
    "White",
    "Blue",
  ]);
  const [color, setColor] = useState("");
  const [shipping, setShipping] = useState("");

  const dispatch = useDispatch();
  const { search } = useSelector((state) => ({ ...state }));
  const { text } = search;

  useEffect(() => {
    loadAllProducts();
    getCategories().then((response) => setCategories(response.data));
    getSubs().then((response) => setSubs(response.data));
  }, []);

  const fetchProducts = (arg) => {
    fetchProductsByFilter(arg).then((response) => {
      setProducts(response.data);
    });
  };

  const loadAllProducts = () => {
    getProductsByCount(12).then((response) => {
      setProducts(response.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    const delayed = setTimeout(() => {
      fetchProducts({ query: text });
      if (!text) {
        loadAllProducts();
      }
    }, 300);

    return () => clearTimeout(delayed);
  }, [text]);

  useEffect(() => {
    fetchProducts({ price });
  }, [ok]);

  const resetSearch = () => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
  };

  const handleSlider = (value) => {
    resetSearch();
    setCategoryIds([]);
    setPrice(value);
    setSub("");
    setBrand("");
    setColor("");
    setShipping("");
    setTimeout(() => setOk(!ok), 300);
  };

  const handleCheck = (e) => {
    resetSearch();
    setPrice([0, 0]);
    setSub("");
    setBrand("");
    setColor("");
    setShipping("");

    const inTheState = [...categoryIds];
    const justChecked = e.target.value;
    const foundInTheState = inTheState.indexOf(justChecked);

    if (foundInTheState === -1) {
      inTheState.push(justChecked);
    } else {
      inTheState.splice(foundInTheState, 1);
    }

    setCategoryIds(inTheState);
    fetchProducts({ category: inTheState });
  };

  const handleSub = (item) => {
    setSub(item._id);
    resetSearch();
    setPrice([0, 0]);
    setCategoryIds([]);
    setBrand("");
    setColor("");
    setShipping("");
    fetchProducts({ sub: item._id });
  };

  const handleBrand = (e) => {
    setSub("");
    resetSearch();
    setPrice([0, 0]);
    setCategoryIds([]);
    setColor("");
    setBrand(e.target.value);
    setShipping("");
    fetchProducts({ brand: e.target.value });
  };

  const handleColor = (e) => {
    setSub("");
    resetSearch();
    setPrice([0, 0]);
    setCategoryIds([]);
    setBrand("");
    setColor(e.target.value);
    setShipping("");
    fetchProducts({ color: e.target.value });
  };

  const handleShippingChange = (e) => {
    setSub("");
    resetSearch();
    setPrice([0, 0]);
    setCategoryIds([]);
    setBrand("");
    setColor("");
    setShipping(e.target.value);
    fetchProducts({ shipping: e.target.value });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 pt-2">
          <h4>Search/Filter</h4>
          <hr />

          <Menu defaultOpenKeys={["1", "2", "3", "4", "5", "6"]} mode="inline">
            <SubMenu
              key="1"
              title={
                <span className="h6">
                  <DollarOutlined /> Price
                </span>
              }
            >
              <div>
                <Slider
                  className="ml-4 mr-4"
                  tipFormatter={(value) => `$${value}`}
                  range
                  value={price}
                  onChange={handleSlider}
                  max={4999}
                />
              </div>
            </SubMenu>

            <SubMenu
              key="2"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Categories
                </span>
              }
            >
              <div>
                {categories.map((item) => (
                  <div key={item._id}>
                    <Checkbox
                      onChange={handleCheck}
                      className="pb-2 pl-4 pr-4"
                      value={item._id}
                      checked={categoryIds.includes(item._id)}
                    >
                      {item.name}
                    </Checkbox>
                    <br />
                  </div>
                ))}
              </div>
            </SubMenu>

            <SubMenu
              key="3"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Sub Categories
                </span>
              }
            >
              <div className="pl-4 pr-4">
                {subs.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleSub(item)}
                    className={`p-1 m-1 badge ${
                      sub === item._id ? "badge-primary" : "badge-secondary"
                    }`}
                    style={{ cursor: "pointer" }}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </SubMenu>

            <SubMenu
              key="4"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Brands
                </span>
              }
            >
              <div className="pr-5">
                {brands.map((item) => (
                  <Radio
                    key={item}
                    value={item}
                    checked={item === brand}
                    onChange={handleBrand}
                    className="pb-1 pl-4 pr-4"
                  >
                    {item}
                  </Radio>
                ))}
              </div>
            </SubMenu>

            <SubMenu
              key="5"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Colors
                </span>
              }
            >
              <div className="pr-5">
                {colors.map((item) => (
                  <Radio
                    key={item}
                    value={item}
                    checked={item === color}
                    onChange={handleColor}
                    className="pb-1 pl-4 pr-4"
                  >
                    {item}
                  </Radio>
                ))}
              </div>
            </SubMenu>

            <SubMenu
              key="6"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Shipping
                </span>
              }
            >
              <div className="pr-5">
                <Checkbox
                  className="pb-2 pl-4 pr-4"
                  onChange={handleShippingChange}
                  value="Yes"
                  checked={shipping === "Yes"}
                >
                  Yes
                </Checkbox>

                <Checkbox
                  className="pb-2 pl-4 pr-4"
                  onChange={handleShippingChange}
                  value="No"
                  checked={shipping === "No"}
                >
                  No
                </Checkbox>
              </div>
            </SubMenu>
          </Menu>
        </div>

        <div className="col-md-9 pt-2">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4 className="text-danger">Products</h4>
          )}

          {products.length < 1 && <p>No products found</p>}

          <div className="row pb-5">
            {products.map((product) => (
              <div key={product._id} className="col-md-4 mt-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
