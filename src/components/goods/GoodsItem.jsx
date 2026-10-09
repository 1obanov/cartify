import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../../context/context";
import { renderStars } from "../../utils/renderStars";
import { useWishlistActions } from "../../hooks/useWishlistActions";
import { useCartActions } from "../../hooks/useCartActions";
import { ImageWithFallback } from "../../components/shared/ImageWithFallback";
import { Heart } from "lucide-react";

function GoodsItem(props) {
  const {
    id,
    title,
    price,
    rating,
    reviews,
    images,
    brand,
    category,
    tags,
    discountPercentage,
  } = props;
  const { state } = useContext(ShopContext);
  const { cart, wishlist } = state;
  const [quantity] = useState(1);
  const { addToWishlist, removeFromWishlist } = useWishlistActions();
  const { addToCart } = useCartActions();

  const isInWishlist = wishlist.some((item) => item.id === id);

  const discountedPrice = price * (1 - discountPercentage / 100);

  const handleAddToCart = () => {
    addToCart(cart, {
      id,
      title,
      price,
      image: images[0],
      ...(brand !== undefined && { brand }),
      ...(category !== undefined && { category }),
      ...(tags !== undefined && { tags }),
      quantity,
      rating,
      reviewCount: reviews.length,
      ...(discountPercentage !== undefined && { discountedPrice }),
      ...(discountPercentage !== undefined && { discount: discountPercentage }),
    });
  };

  const handleAddToWishlist = () => {
    addToWishlist({
      id,
      title,
      price,
      image: images[0],
      ...(brand !== undefined && { brand }),
      ...(category !== undefined && { category }),
      ...(tags !== undefined && { tags }),
      discountPercentage,
      rating,
      reviewCount: reviews.length,
    });
  };

  const handleRemoveFromWishlist = () => {
    removeFromWishlist(id);
  };

  return (
    <li className="list__item" product-id={id}>
      <div className="card">
        <div className="card__img">
          <ImageWithFallback src={images[0]} alt={title} />
          {discountPercentage !== undefined && (
            <span className="discount">-{discountPercentage}%</span>
          )}
          <div className="card__wishlist">
            {isInWishlist ? (
              <button
                className="remove-from-wishlist"
                onClick={handleRemoveFromWishlist}
              >
                <Heart
                  strokeWidth="1.2"
                  size="20"
                  fill="#E50010"
                  stroke="#E50010"
                />
              </button>
            ) : (
              <button className="add-to-wishlist" onClick={handleAddToWishlist}>
                <Heart strokeWidth="1.2" size="20" />
              </button>
            )}
          </div>
          <button className="btn btn--small" onClick={handleAddToCart}>
            Add to cart
          </button>
        </div>
        <div className="card__body">
          <div className="price">
            <span
              className={`price__full ${
                discountPercentage !== undefined ? "price__full--crossed" : ""
              }`}
            >
              ${price.toFixed(2)}
            </span>
            {discountPercentage !== undefined && (
              <span className="price__discounted">
                ${discountedPrice.toFixed(2)}
              </span>
            )}
          </div>
          <Link to={`/product/${id}`} className="title">
            {title}
          </Link>
          <div className="rating">
            <div className="stars">{renderStars(rating)}</div>
            <span className="reviews">{reviews.length} reviews</span>
          </div>
        </div>
      </div>
    </li>
  );
}

export { GoodsItem };
