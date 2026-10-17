import { useState } from "react";
import { Link } from "react-router-dom";
import { renderStars } from "../../utils/renderStars";
import { useWishlistActions } from "../../hooks/useWishlistActions";
import { useCartActions } from "../../hooks/useCartActions";
import { ImageWithFallback } from "../shared/ImageWithFallback";
import { Trash2 } from "lucide-react";
import { useShopContext } from "../../context/context";
import type { WishlistItem } from "../../context/reducer";

function WishListItem(props: WishlistItem) {
  const {
    id,
    title,
    price,
    image,
    brand,
    category,
    tags,
    rating,
    reviewCount,
    discountedPrice,
    discount,
  } = props;
  const { state } = useShopContext();
  const { cart } = state;
  const [quantity] = useState(1);
  const { removeFromWishlist } = useWishlistActions();
  const { addToCart } = useCartActions();

  const hasDiscount =
    discountedPrice !== undefined && !Number.isNaN(discountedPrice);

  // Function to handle adding product to the shopping cart
  const handleAddToCart = () => {
    addToCart(cart, {
      id,
      title,
      price,
      image,
      ...(brand !== undefined && { brand }),
      ...(category !== undefined && { category }),
      ...(tags !== undefined && { tags }),
      quantity,
      ...(hasDiscount && { discountedPrice }),
      ...(typeof discount !== "undefined" && { discount }),
    });
  };

  // Function to handle removing the product from the wishlist
  const handleRemoveFromWishlist = () => {
    removeFromWishlist(id);
  };

  return (
    <li className="list__item" product-id={id}>
      <div className="card">
        <div className="card__img">
          <ImageWithFallback src={image} alt={title} />
          {typeof discount !== "undefined" && (
            <span className="discount">-{discount}%</span>
          )}
          <button
            className="remove-from-wishlist"
            onClick={handleRemoveFromWishlist}
          >
            <Trash2 strokeWidth="1.2" size="20" />
          </button>
          <button className="btn btn--small" onClick={handleAddToCart}>
            Add to cart
          </button>
        </div>
        <div className="card__body">
          <div className="price">
            <span
              className={`price__full ${
                hasDiscount ? "price__full--crossed" : ""
              }`}
            >
              ${price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="price__discounted">
                ${discountedPrice.toFixed(2)}
              </span>
            )}
          </div>
          <Link to={`/product/${id}`} className="title">
            {title}
          </Link>
          <div className="rating">
            {typeof rating === "number" ? (
              <>
                <div className="stars">{renderStars(rating)}</div>
                <span className="reviews">{reviewCount ?? 0} reviews</span>
              </>
            ) : (
              <span className="reviews">No reviews yet</span>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

export { WishListItem };
