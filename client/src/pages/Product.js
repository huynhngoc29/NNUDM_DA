import React, { useEffect, useState } from "react";
import { getProduct, getRelated } from "../functions/product";
import ProductCard from "../components/cards/ProductCard";
import ProductListItems from "../components/cards/ProductListItems";

const placeholderImage = "https://via.placeholder.com/800x600?text=Product";

const Product = ({ match }) => {
  const [product, setProduct] = useState({});
  const [related, setRelated] = useState([]);
  const { slug } = match.params;

  useEffect(() => {
    loadSingleProduct();
  }, [slug]);

  const loadSingleProduct = () => {
    getProduct(slug).then((response) => {
      setProduct(response.data);
      getRelated(response.data._id).then((relatedResponse) =>
        setRelated(relatedResponse.data)
      );
    });
  };

  return (
    <div className="container-fluid">
      <div className="row pt-4">
        <div className="col-md-7">
          <img
            src={
              product.images && product.images.length
                ? product.images[0].url
                : placeholderImage
            }
            alt={product.title}
            className="img-fluid"
          />
        </div>
        <div className="col-md-5">
          <h2>{product.title}</h2>
          <p>{product.description}</p>
          <ProductListItems product={product} />
        </div>
      </div>

      <div className="row">
        <div className="col text-center pt-5 pb-5">
          <hr />
          <h4>Related Products</h4>
          <hr />
        </div>
      </div>

      <div className="row pb-5">
        {related.length ? (
          related.map((item) => (
            <div key={item._id} className="col-md-4">
              <ProductCard product={item} />
            </div>
          ))
        ) : (
          <div className="text-center col">No Products Found</div>
        )}
      </div>
    </div>
  );
};

export default Product;
