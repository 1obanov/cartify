import { Link } from "react-router-dom";
import { useToggleMiniCart } from "../../hooks/useToggleMiniCart";
import { ImageWithFallback } from "../shared/ImageWithFallback";

interface OrderItemProps {
  id: number;
  title: string;
  image: string;
  price: number;
  quantity: number;
  brand?: string;
  category?: string;
  tags?: string[];
  discountedPrice?: number;
  showInfo?: boolean;
  showOnlyQty?: boolean;
  enableToggle?: boolean;
  imageModifier?: string;
}

function OrderItem({
  id,
  title,
  image,
  price,
  brand,
  category,
  tags,
  quantity,
  discountedPrice,
  showInfo = true,
  showOnlyQty = false,
  enableToggle = true,
  imageModifier = "",
}: OrderItemProps) {
  const { toggleMiniCart } = useToggleMiniCart();

  const hasDiscount =
    discountedPrice !== undefined && !Number.isNaN(discountedPrice);

  const handleLinkClick = () => {
    if (enableToggle) {
      toggleMiniCart();
    }
  };

  return (
    <div className="order-card">
      <Link
        to={`/product/${id}`}
        className="order-card__wrapper"
        onClick={handleLinkClick}
      >
        <div
          className={`image ${imageModifier ? `image--${imageModifier}` : ""}`}
        >
          <ImageWithFallback src={image} alt={title} size="20" />
        </div>
        <div className="content">
          <span className="title">{title}</span>
          {showInfo && (
            <div className="info">
              <dl>
                {brand && (
                  <>
                    <dt>Brand:</dt>
                    <dd>{brand}</dd>
                  </>
                )}
                {category && (
                  <>
                    <dt>Category:</dt>
                    <dd>{category}</dd>
                  </>
                )}
                {tags && tags.length > 0 && (
                  <>
                    <dt>Tags:</dt>
                    <dd>{tags.join(", ")}</dd>
                  </>
                )}
                {quantity && (
                  <>
                    <dt>Quantity:</dt>
                    <dd>{quantity}</dd>
                  </>
                )}
              </dl>
            </div>
          )}
          {showOnlyQty && (
            <div className="info">
              <dl>
                <dt>Quantity:</dt>
                <dd>{quantity}</dd>
              </dl>
            </div>
          )}
        </div>
        <div className="price">
          {hasDiscount && (
            <span className="price__discounted">
              ${discountedPrice.toFixed(2)}
            </span>
          )}
          <span
            className={`price__full ${
              hasDiscount ? "price__full--crossed" : ""
            }`}
          >
            ${price.toFixed(2)}
          </span>
        </div>
      </Link>
    </div>
  );
}

export { OrderItem };
