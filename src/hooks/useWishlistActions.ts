import { doc, getDoc, setDoc } from "firebase/firestore";
import type { WishlistItem } from "../context/reducer";
import { auth, db } from "../firebase";
import { handleAnimation } from "../utils/handleAnimation";
import { useTogglePopup } from "./useTogglePopup";

export const useWishlistActions = () => {
  const { togglePopup } = useTogglePopup();

  // Function to add a product to the wishlist
  const addToWishlist = async (product: WishlistItem) => {
    if (!auth.currentUser) {
      // If the user is not authenticated, show the popup
      togglePopup();
      return;
    }

    const userId = auth.currentUser.uid;
    const wishlistRef = doc(db, "wishlists", userId);

    try {
      const wishlistSnap = await getDoc(wishlistRef);
      const existingWishlist: WishlistItem[] = wishlistSnap.exists()
        ? wishlistSnap.data().items
        : [];

      // Create an updated wishlist by adding the new product
      const updatedWishlist = [
        ...existingWishlist,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          ...(product.brand !== undefined && { brand: product.brand }),
          ...(product.category !== undefined && { category: product.category }),
          ...(product.tags !== undefined && { tags: product.tags }),
          ...(product.rating !== undefined && { rating: product.rating }),
          ...(product.reviewCount !== undefined && {
            reviewCount: product.reviewCount,
          }),
          ...(product.discountedPrice !== undefined && {
            discountedPrice: product.discountedPrice,
          }),
          ...(product.discount !== undefined && {
            discount: product.discount,
          }),
        },
      ];

      // Save the updated wishlist to Firestore
      await setDoc(wishlistRef, { items: updatedWishlist });

      // Trigger a "pulse" animation on the wishlist icon
      handleAnimation({
        selector: ".badge--wishlist",
        animationClass: "pulse",
      });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  // Function to remove a product from the wishlist
  const removeFromWishlist = async (productId: number) => {
    if (!auth.currentUser) return;

    const userId = auth.currentUser.uid;
    const wishlistRef = doc(db, "wishlists", userId);

    try {
      const wishlistSnap = await getDoc(wishlistRef);
      if (!wishlistSnap.exists()) return;

      const existingWishlist: WishlistItem[] = wishlistSnap.data().items || [];
      const updatedWishlist: WishlistItem[] = existingWishlist.filter(
        (item) => item.id !== productId,
      );

      // Save the updated wishlist to Firestore
      await setDoc(wishlistRef, { items: updatedWishlist });

      // Trigger a "pulse" animation on the wishlist icon
      handleAnimation({
        selector: ".badge--wishlist",
        animationClass: "pulse",
      });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  return { addToWishlist, removeFromWishlist };
};
