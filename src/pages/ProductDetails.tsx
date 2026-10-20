import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Preloader } from "../components/shared/Preloader";
import { renderStars } from "../utils/renderStars";
import { useWishlistActions } from "../hooks/useWishlistActions";
import { useCartActions } from "../hooks/useCartActions";
import { ImageWithFallback } from "../components/shared/ImageWithFallback";
import { House, Heart, TriangleAlert } from "lucide-react";
import { useShopContext } from "../context/context";

import "toastify-js/src/toastify.css";
import { Product } from "../types/product";

type HandleQuantityChange = "increment" | "decrement";

function ProductDetails() {
  const { id } = useParams();
  const { state, dispatch } = useShopContext();
  const { product, loadingProduct, cart, wishlist } = state;
  const [quantity, setQuantity] = useState(1);
  const [productError, setProductError] = useState("");
  const { addToWishlist, removeFromWishlist } = useWishlistActions();
  const { addToCart } = useCartActions();

  useEffect(() => {
    const controller = new AbortController();
    setProductError("");

    async function fetchProduct() {
      try {
        const response = await fetch(`https://dummyjson.com/products/${id}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Product request failed with status ${response.status}`,
          );
        }

        const data: Product = await response.json();

        if (!data || !data.id) {
          throw new Error("Product was missing from the API response");
        }

        dispatch({ type: "SET_PRODUCT", payload: data });
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        console.error("Error fetching product details:", error);
        setProductError("Could not load this product. Please try again later.");
        dispatch({ type: "SET_LOADING_PRODUCT", payload: false });
      }
    }

    fetchProduct();

    return () => {
      controller.abort();
      dispatch({ type: "CLEAR_PRODUCT" });
      dispatch({ type: "SET_LOADING_PRODUCT", payload: true });
    };
  }, [id, dispatch]);

  if (loadingProduct) {
    return <Preloader />;
  }

  if (productError) {
    return (
      <div className="section product-details">
        <div className="container">
          <div className="api-error">
            <span className="api-error__icon">
              <TriangleAlert size={28} strokeWidth={1.6} />
            </span>
            <h1>Product unavailable</h1>
            <p>{productError}</p>
            <Link to="/" className="btn">
              Back to shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="section product-details">
        <div className="container">
          <div className="api-error">
            <span className="api-error__icon">
              <TriangleAlert size={28} strokeWidth={1.6} />
            </span>
            <h1>Product unavailable</h1>
            <p>
              Sorry, we couldn't display this product right now. Please return
              to the shop and try again.
            </p>
            <Link to="/" className="btn">
              Back to shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Checking if the product is already in the wishlist
  const isInWishlist = wishlist.some((item) => item.id === product.id);

  // Calculating the discounted price
  const discountedPrice =
    product.price * (1 - product.discountPercentage / 100);

  // Function to handle the adding the product to the cart
  const handleAddToCart = () => {
    addToCart(cart, {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images?.[0],
      ...(product.brand !== undefined && { brand: product.brand }),
      ...(product.category !== undefined && { category: product.category }),
      ...(product.tags !== undefined && { tags: product.tags }),
      quantity,
      ...(product.discountPercentage !== undefined && { discountedPrice }),
      ...(product.discountPercentage !== undefined && {
        discount: product.discountPercentage,
      }),
      rating: product.rating,
      reviewCount: product.reviews.length,
    });
  };

  // Function to handle the adding the product to the wishlist
  const handleAddToWishlist = () => {
    addToWishlist({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images?.[0],
      ...(product.brand !== undefined && { brand: product.brand }),
      ...(product.category !== undefined && { category: product.category }),
      ...(product.tags !== undefined && { tags: product.tags }),
      // discountPercentage: product.discountPercentage,
      discount: product.discountPercentage,
      discountedPrice,
      rating: product.rating,
      reviewCount: product.reviews.length,
    });
  };

  // Function to handle the removing the product from the wishlist
  const handleRemoveFromWishlist = () => {
    removeFromWishlist(product.id);
  };

  // Function to handle the changing the quantity of the product
  const handleQuantityChange = (type: HandleQuantityChange) => {
    setQuantity((prev) => {
      if (type === "increment") {
        return Math.min(20, prev + 1);
      } else {
        return Math.max(1, prev - 1);
      }
    });
  };

  return (
    <div className="section product-details">
      <div className="breadcrumb">
        <div className="container">
          <ul>
            <li className="breadcrumb__item">
              <Link to={`/`}>
                <House strokeWidth="2" size="16" />
                Home
              </Link>
            </li>
            <li className="breadcrumb__item active">{product.title}</li>
          </ul>
        </div>
      </div>
      <div className="container">
        <div className="product-details__wrapper">
          <div className="product-details__image">
            <ImageWithFallback src={product.images?.[0]} alt={product.title} />
          </div>
          <div className="product-details__info">
            <div className="price">
              <span
                className={`price__full ${
                  product.discountPercentage !== undefined
                    ? "price__full--crossed"
                    : ""
                }`}
              >
                {product && product.price && `$${product.price.toFixed(2)}`}
              </span>
              {product.discountPercentage !== undefined && (
                <span className="price__discounted">
                  ${discountedPrice.toFixed(2)}
                </span>
              )}
            </div>
            <h1 className="product-details__title">{product.title}</h1>
            <div className="rating">
              {product.rating ? (
                <>
                  <div className="stars">{renderStars(product.rating)}</div>
                  <span className="divider">|</span>
                  <span className="reviews">
                    ({product.reviews.length} customer reviews)
                  </span>
                </>
              ) : (
                <span>No reviews yet</span>
              )}
            </div>
            <p className="product-details__description">
              {product.description}
            </p>
            <div className="product-details__actions">
              <div className="quantity">
                <span
                  className="decrement"
                  onClick={() => handleQuantityChange("decrement")}
                >
                  -
                </span>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.max(1, Math.min(20, parseInt(e.target.value) || 1)),
                    )
                  }
                />
                <span
                  className="increament"
                  onClick={() => handleQuantityChange("increment")}
                >
                  +
                </span>
              </div>
              <button className="btn" onClick={handleAddToCart}>
                Add to cart
              </button>
            </div>
            <div className="product-details__wishlist">
              {isInWishlist ? (
                <button
                  className="wishlist-btn"
                  onClick={handleRemoveFromWishlist}
                >
                  <span className="ico">
                    <Heart
                      strokeWidth="1.2"
                      size="20"
                      fill="#E50010"
                      stroke="#E50010"
                    />
                  </span>
                  <span className="text">Remove from wishlist</span>
                </button>
              ) : (
                <button className="wishlist-btn" onClick={handleAddToWishlist}>
                  <span className="ico">
                    <Heart strokeWidth="1.2" size="20" />
                  </span>
                  <span className="text">Add to wishlist</span>
                </button>
              )}
            </div>
            <div className="product-details__meta">
              <dl>
                {product.sku && (
                  <>
                    <dt>SKU:</dt>
                    <dd>{product.sku}</dd>
                  </>
                )}
                {product.brand && (
                  <>
                    <dt>Brand:</dt>
                    <dd>{product.brand}</dd>
                  </>
                )}
                {product.category && (
                  <>
                    <dt>Category:</dt>
                    <dd>{product.category}</dd>
                  </>
                )}
                {product.tags && (
                  <>
                    <dt>Tags:</dt>
                    <dd>{product.tags.join(", ")}</dd>
                  </>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { ProductDetails };
