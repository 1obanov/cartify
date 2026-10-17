import { doc, onSnapshot } from "firebase/firestore";
import type { UserDetails } from "../context/reducer";
import { db } from "../firebase";

const subscribeUserDetails = (
  userId: string,
  setUserDetails: (details: UserDetails | null) => void,
) => {
  if (!userId) return;

  const userRef = doc(db, "users", userId);

  return onSnapshot(userRef, (snapshot) => {
    if (snapshot.exists()) {
      const userData = snapshot.data() as UserDetails;
      setUserDetails(userData);
    } else {
      setUserDetails(null);
    }
  });
};

export { subscribeUserDetails };
