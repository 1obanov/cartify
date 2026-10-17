import { useShopContext } from "../context/context";

export const useToggleMiniCart = () => {
  const { dispatch } = useShopContext();

  const toggleMiniCart = () => {
    dispatch({ type: "TOGGLE_MINI_CART" });
  };

  return { toggleMiniCart };
};
