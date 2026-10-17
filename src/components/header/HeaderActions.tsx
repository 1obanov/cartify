import { Link } from "react-router-dom";
import { useToggleMiniCart } from "../../hooks/useToggleMiniCart";
import { UserRound, Heart, ShoppingCart } from "lucide-react";
import { useShopContext } from "../../context/context";

function HeaderActions() {
  const { state } = useShopContext();
  const { cart, wishlist, isAuthenticated } = state;
  const { toggleMiniCart } = useToggleMiniCart();

  const cartCount = cart.length;
  const wishlistCount = wishlist.length;

  return (
    <div className="header-actions">
      <Link
        to={isAuthenticated ? "/account" : "/auth"}
        className="badge badge--account"
      >
        <UserRound strokeWidth={1.2} size={25} />
      </Link>
      <Link to="/wishlist" className="badge badge--wishlist">
        <Heart strokeWidth="1.2" size="25" />
        {wishlistCount > 0 && <span>{wishlistCount}</span>}
      </Link>
      <button
        type="button"
        className="badge badge--basket"
        onClick={toggleMiniCart}
      >
        <ShoppingCart strokeWidth="1.2" size="25" />
        {cartCount > 0 && <span>{cartCount}</span>}
      </button>
    </div>
  );
}

export { HeaderActions };
