import React from "react";
import { Card } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Meta } = Card;
const placeholderImage = "https://via.placeholder.com/600x450?text=Product";

const ProductCard = ({ product }) => {
  const { images, title, description, slug, price, quantity } = product;

  return (
    <Card
      cover={
        <img
          src={images && images.length ? images[0].url : placeholderImage}
          alt={title}
          style={{ height: "180px", objectFit: "cover" }}
          className="p-1"
        />
      }
      actions={[
        <Link to={`/product/${slug}`} key={`view-${slug}`}>
          <EyeOutlined className="text-warning" /> <br /> View Product
        </Link>,
      ]}
    >
      <Meta
        title={`${title} - $${price}`}
        description={
          quantity < 1
            ? "Out of stock"
            : `${description && description.substring(0, 60)}...`
        }
      />
    </Card>
  );
};

export default ProductCard;
