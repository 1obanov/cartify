import { doc, onSnapshot } from "firebase/firestore";
import type { Unsubscribe } from "firebase/firestore";
import type { CartItem } from "../context/reducer";
import { db } from "../firebase";

const subscribeToCart = (
  userId: string,
  onCartChange: (items: CartItem[]) => void,
): Unsubscribe | undefined => {
  if (!userId) return;

  const userCartRef = doc(db, "carts", userId);

  return onSnapshot(userCartRef, (snapshot) => {
    if (snapshot.exists()) {
      onCartChange(snapshot.data().items || []);
    } else {
      onCartChange([]);
    }
  });
};

export { subscribeToCart };
