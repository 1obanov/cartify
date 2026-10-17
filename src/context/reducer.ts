import type { Timestamp } from "firebase/firestore";
import type { Product } from "../types/product";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  brand?: string;
  category?: string;
  tags?: string[];
  rating?: number;
  reviewCount?: number;
  discountedPrice?: number;
  discount?: number;
}

export interface WishlistItem {
  id: number;
  title: string;
  price: number;
  image: string;
  brand?: string;
  category?: string;
  tags?: string[];
  rating?: number;
  reviewCount?: number;
  discountedPrice?: number;
  discount?: number;
}

export interface OrderDetails {
  address: string;
  cardName: string;
  cardLastFour: string;
  city: string;
  deliveryMethod: string;
  email: string;
  expiryDate: string;
  firstName: string;
  lastName: string;
  postcode: string;
}

export interface UserOrder {
  id: string;
  deliveryPrice: number;
  order: CartItem[];
  orderDate: string;
  orderDetails: OrderDetails;
  orderNumber: string;
  subTotalPrice: number;
  timestamp: number;
  totalPrice: number;
  userId: string;
}

export interface UserAddress {
  address: string;
  city: string;
  email: string;
  firstName: string;
  lastName: string;
  postcode: string;
}

export interface UserDetails {
  address?: UserAddress | string;
  createdAt?: Timestamp;
  dob?: Timestamp | null;
  email: string;
  firstName: string;
  lastName: string;
  photoURL?: string;
  uid: string;
}

export type CheckoutStepIndex = 0 | 1 | 2;

export interface ShopState {
  goods: Product[];
  cart: CartItem[];
  userOrders: UserOrder[];
  userDetails: UserDetails | null;
  wishlist: WishlistItem[];
  isAuthenticated: boolean | null;
  isMiniCartShow: boolean;
  isPopupShow: boolean;
  loadingGoods: boolean;
  loadingCart: boolean;
  loadingUserOrders: boolean;
  loadingUserDetails: boolean;
  loadingProduct: boolean;
  loadingWishlist: boolean;
  product: Product | null;
  currentStep: CheckoutStepIndex;
}

export type ShopAction =
  | { type: "SET_GOODS"; payload: Product[] }
  | { type: "SET_LOADING_GOODS"; payload: boolean }
  | { type: "SET_CART"; payload: CartItem[] }
  | { type: "SET_WISHLIST"; payload: WishlistItem[] }
  | { type: "ADD_TO_BASKET"; payload: CartItem }
  | { type: "REMOVE_FROM_BASKET"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "SET_AUTHENTICATED"; payload: boolean }
  | { type: "TOGGLE_MINI_CART" }
  | { type: "TOGGLE_POPUP" }
  | { type: "SET_PRODUCT"; payload: Product }
  | { type: "CLEAR_PRODUCT" }
  | { type: "CLEAR_WISHLIST" }
  | { type: "SET_LOADING_WISHLIST"; payload: boolean }
  | { type: "SET_LOADING_PRODUCT"; payload: boolean }
  | { type: "SET_CURRENT_STEP"; payload: CheckoutStepIndex }
  | { type: "CLEAR_CART" }
  | {
      type: "SET_USER_ORDER";
      payload: { userOrders: UserOrder[]; loadingUserOrders: boolean };
    }
  | {
      type: "SET_USER_DETAILS";
      payload: { userDetails: UserDetails | null; loadingUserDetails: boolean };
    };

export const shopReducer = (state: ShopState, action: ShopAction) => {
  switch (action.type) {
    case "SET_GOODS":
      return {
        ...state,
        goods: action.payload,
        loadingGoods: false,
      };

    case "SET_LOADING_GOODS":
      return { ...state, loadingGoods: action.payload };

    case "SET_CART":
      return { ...state, cart: action.payload, loadingCart: false };

    case "SET_USER_ORDER":
      return {
        ...state,
        userOrders: action.payload.userOrders,
        loadingUserOrders: action.payload.loadingUserOrders,
      };

    case "SET_USER_DETAILS":
      return {
        ...state,
        userDetails: action.payload.userDetails,
        loadingUserDetails: action.payload.loadingUserDetails,
      };

    case "ADD_TO_BASKET":
      const itemIndex = state.cart.findIndex(
        (cartItem) => cartItem.id === action.payload.id,
      );

      let newCartItem = null;
      if (itemIndex < 0) {
        const newItem = {
          ...action.payload,
        };
        newCartItem = [...state.cart, newItem];
      } else {
        newCartItem = state.cart.map((cartItem, index) => {
          if (index === itemIndex) {
            return {
              ...cartItem,
              quantity: cartItem.quantity + action.payload.quantity,
            };
          } else {
            return cartItem;
          }
        });
      }

      return {
        ...state,
        cart: newCartItem,
      };

    case "REMOVE_FROM_BASKET":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item,
        ),
      };

    case "SET_AUTHENTICATED":
      return { ...state, isAuthenticated: action.payload };

    case "TOGGLE_MINI_CART":
      return {
        ...state,
        isMiniCartShow: !state.isMiniCartShow,
      };

    case "TOGGLE_POPUP":
      return {
        ...state,
        isPopupShow: !state.isPopupShow,
      };

    case "SET_PRODUCT":
      return {
        ...state,
        product: action.payload,
        loadingProduct: false,
      };

    case "CLEAR_PRODUCT":
      return {
        ...state,
        product: null,
      };

    case "SET_WISHLIST":
      return {
        ...state,
        wishlist: action.payload,
        loadingWishlist: false,
      };

    case "CLEAR_WISHLIST":
      return {
        ...state,
        wishlist: [],
      };

    case "SET_LOADING_WISHLIST":
      return { ...state, loadingWishlist: action.payload };

    case "SET_LOADING_PRODUCT":
      return {
        ...state,
        loadingProduct: action.payload,
      };

    case "SET_CURRENT_STEP":
      return {
        ...state,
        currentStep: action.payload,
      };

    case "CLEAR_CART":
      return {
        ...state,
        cart: [],
      };

    default:
      return state;
  }
};
