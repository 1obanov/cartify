import { useShopContext } from "../context/context";

export const useTogglePopup = () => {
  const { dispatch } = useShopContext();

  const togglePopup = () => {
    dispatch({ type: "TOGGLE_POPUP" });
  };

  return { togglePopup };
};
