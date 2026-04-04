import React, { useState } from "react";
import { Card, Tooltip } from "antd";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import _ from "lodash";
import { useDispatch } from "react-redux";

const { Meta } = Card;
const placeholderImage = "https://via.placeholder.com/600x450?text=Product";

const ProductCard = ({ product }) => {
  const [tooltip, setTooltip] = useState("Click to add");
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    let cart = [];
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      cart.push({
        ...product,
        count: 1,
      });

      const unique = _.uniqWith(cart, _.isEqual);
      localStorage.setItem("cart", JSON.stringify(unique));
      setTooltip("Added");

      dispatch({
        type: "ADD_TO_CART",
        payload: unique,
      });
      dispatch({
        type: "SET_VISIBLE",
        payload: true,
      });
    }
  };

  const { images, title, description, slug, price } = product;

  return (
    <Card
      cover={
        <img
          src={images && images.length ? images[0].url : placeholderImage}
          alt={title}
          style={{ height: "150px", objectFit: "cover" }}
          className="p-1"
        />
      }
      actions={[
        <Link to={`/product/${slug}`} key={`view-${slug}`}>
          <EyeOutlined className="text-warning" /> <br /> View Product
        </Link>,
        <Tooltip title={tooltip} key={`cart-${slug}`}>
          <a onClick={handleAddToCart} disabled={product.quantity < 1}>
            <ShoppingCartOutlined className="text-danger" /> <br />
            {product.quantity < 1 ? "Out of stock" : "Add to Cart"}
          </a>
        </Tooltip>,
      ]}
    >
      <Meta
        title={`${title} - $${price}`}
        description={`${description && description.substring(0, 40)}...`}
      />
    </Card>
  );
};

export default ProductCard;
