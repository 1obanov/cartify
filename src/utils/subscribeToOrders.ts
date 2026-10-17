import { collection, query, where, onSnapshot } from "firebase/firestore";
import type { Unsubscribe } from "firebase/firestore";
import type { UserOrder } from "../context/reducer";
import { db } from "../firebase";

const subscribeToOrders = (
  userId: string,
  callback: (orders: UserOrder[]) => void,
): Unsubscribe | undefined => {
  if (!userId) return;

  const ordersRef = collection(db, "orders");
  const q = query(ordersRef, where("userId", "==", userId));

  return onSnapshot(q, (querySnapshot) => {
    const updatedOrders = querySnapshot.docs.map((orderDoc) => ({
      ...orderDoc.data(),
      id: orderDoc.id,
    })) as UserOrder[];

    callback(updatedOrders);
  });
};

export { subscribeToOrders };
