import { doc, onSnapshot } from "firebase/firestore";
import type { WishlistItem } from "../context/reducer";
import { db } from "../firebase";

const subscribeToWishlist = (
  userId: string,
  setUserWishlist: (items: WishlistItem[]) => void,
) => {
  if (!userId) return;

  const userWishlistRef = doc(db, "wishlists", userId);

  return onSnapshot(userWishlistRef, (snapshot) => {
    if (snapshot.exists()) {
      setUserWishlist(snapshot.data().items || []);
    } else {
      setUserWishlist([]);
    }
  });
};

export { subscribeToWishlist };
