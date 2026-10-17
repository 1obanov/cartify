import { doc, getDoc, setDoc } from "firebase/firestore";
import type { CartItem } from "../context/reducer";
import { db } from "../firebase";
import { mergeCartItems } from "./mergeCartItems";

// Function to merge carts (local and Firebase)
const mergeCarts = async (userId: string): Promise<CartItem[] | undefined> => {
  if (!userId) return;

  try {
    const localCart: CartItem[] = JSON.parse(
      localStorage.getItem("cartItems") ?? "[]",
    );
    const userCartRef = doc(db, "carts", userId);
    const userCartSnap = await getDoc(userCartRef);
    let firebaseCart: CartItem[] = userCartSnap.exists()
      ? userCartSnap.data().items
      : [];

    // Merge the local and Firebase carts
    const mergedCart = mergeCartItems(firebaseCart, localCart);

    // Save the merged cart back to Firebase
    await setDoc(userCartRef, { items: mergedCart });

    // Clear the localStorage after successful merging
    localStorage.removeItem("cartItems");

    return mergedCart;
  } catch (error) {
    console.error("Error merging carts:", error);
    return [];
  }
};

export { mergeCarts };
