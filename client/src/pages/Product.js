import React, { useEffect, useState } from "react";
import { getProduct, productStar } from "../functions/product";
import SingleProduct from "../components/cards/SingleProduct";
import { useSelector } from "react-redux";
import { getRelated } from "../functions/product";
import ProductCard from "../components/cards/ProductCard";
import StarRating from "react-star-ratings";
import { toast } from "react-toastify";

const Product = ({ match }) => {
  const [product, setProduct] = useState({});
  const [related, setRelated] = useState([]);
  const [star, setStar] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  // redux
  const { user } = useSelector((state) => ({ ...state }));

  const { slug } = match.params;

  useEffect(() => {
    loadSingleProduct();
  }, [slug]);

  useEffect(() => {
    if (product.reviews && user) {
      let existingRatingObject = product.reviews.find((ele) => {
        if (!ele.postedBy) return false;

        const postedBy = ele.postedBy._id
          ? ele.postedBy._id.toString()
          : ele.postedBy.toString();

        return postedBy === user._id.toString();
      });

      if (existingRatingObject) {
        setStar(existingRatingObject.star);
        setReviewComment(existingRatingObject.comment || "");
      } else {
        setStar(0);
        setReviewComment("");
      }
    } else if (!user) {
      setStar(0);
      setReviewComment("");
    }
  }, [product, user]);

  const loadSingleProduct = () => {
    getProduct(slug).then((res) => {
      setProduct(res.data);
      // load related
      getRelated(res.data._id).then((res) => setRelated(res.data));
    });
  };

  const onStarClick = (newRating) => {
    setStar(newRating);
  };

  const handleReviewSubmit = async () => {
    if (!user || !user.token) {
      return false;
    }

    if (!star) {
      toast.error("Please choose a star rating");
      return false;
    }

    return productStar(product._id, star, reviewComment, user.token).then((res) => {
      console.log("rating clicked", res.data);
      toast.success("Review saved");
      loadSingleProduct();
      return true;
    });
  };

  const showReviews = () => {
    if (!product.reviews || !product.reviews.length) {
      return <div className="alert alert-secondary">No reviews yet</div>;
    }

    return product.reviews.map((review) => (
      <div key={review._id} className="card mb-3">
        <div className="card-body">
          <h5>
            {(review.postedBy && (review.postedBy.name || review.postedBy.email)) ||
              "Anonymous User"}
          </h5>
          <StarRating
            starDimension="20px"
            starSpacing="2px"
            starRatedColor="red"
            rating={review.star}
            editing={false}
          />
          <p className="mb-0 mt-2">{review.comment || "No comment"}</p>
        </div>
      </div>
    ));
  };

  return (
    <div className="container-fluid">
      <div className="row pt-4">
        <SingleProduct
          product={product}
          onStarClick={onStarClick}
          star={star}
          reviewComment={reviewComment}
          setReviewComment={setReviewComment}
          handleReviewSubmit={handleReviewSubmit}
        />
      </div>

      <div className="row pt-5 pb-3">
        <div className="col-md-8 offset-md-2">
          <h4>Customer Reviews</h4>
          <hr />
          {showReviews()}
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
          related.map((r) => (
            <div key={r._id} className="col-md-4">
              <ProductCard product={r} />
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
