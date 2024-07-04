import { db } from "../data/db";
import type { CartItem, Guitar } from "../types";

export type CartActions =
   | { type: "ADD_TO_CART"; payload: { item: Guitar } }
   | { type: "REMOVE_FROM_CART"; payload: { id: Guitar["id"] } }
   | { type: "DECREASE_QUANTITY"; payload: { id: Guitar["id"] } }
   | { type: "INCREASE_QUANTITY"; payload: { id: Guitar["id"] } }
   | { type: "CLEAR_CART" };

export type CartState = {
   cart: CartItem[];
   data: Guitar[];
};

const initialCart = (): Array<CartItem> => {
   const localStorageCart = localStorage.getItem("guitarCart");
   return localStorageCart ? JSON.parse(localStorageCart) : [];
};

export const initialState: CartState = {
   cart: initialCart(),
   data: db,
};

const MAX_ITEMS = 5;
const MIN_ITEMS = 1;

export const cartReducer = (
   state: CartState = initialState,
   actions: CartActions
) => {
   if (actions.type === "ADD_TO_CART") {
      const itemExists = state.cart.find(
         (cartItem) => cartItem.id === actions.payload.item.id
      );

      let updatedCart: CartItem[] = [];

      if (itemExists) {
         updatedCart = state.cart.map((cartItem) => {
            if (cartItem.id === actions.payload.item.id) {
               if (cartItem.quantity < MAX_ITEMS) {
                  return {
                     ...cartItem,
                     quantity: cartItem.quantity + 1,
                  };
               }
            }
            return cartItem;
         });
      } else {
         const newItem: CartItem = { ...actions.payload.item, quantity: 1 };
         updatedCart = [...state.cart, newItem];
      }

      return {
         ...state,
         cart: updatedCart,
      };
   }

   if (actions.type === "REMOVE_FROM_CART") {
      const cart = state.cart.filter(
         (cartItem) => cartItem.id !== actions.payload.id
      );

      return {
         ...state,
         cart,
      };
   }

   if (actions.type === "DECREASE_QUANTITY") {
      console.log("fasdf");
      const cart = state.cart.map((cartItem) => {
         if (
            cartItem.id === actions.payload.id &&
            cartItem.quantity > MIN_ITEMS
         ) {
            return {
               ...cartItem,
               quantity: cartItem.quantity - 1,
            };
         }
         return cartItem;
      });

      return {
         ...state,
         cart,
      };
   }

   if (actions.type === "INCREASE_QUANTITY") {
      const cart = state.cart.map((cartItem) => {
         if (
            cartItem.id === actions.payload.id &&
            cartItem.quantity < MAX_ITEMS
         ) {
            return {
               ...cartItem,
               quantity: cartItem.quantity + 1,
            };
         }
         return cartItem;
      });

      return {
         ...state,
         cart,
      };
   }

   if (actions.type === "CLEAR_CART") {
      return {
         ...state,
         cart: [],
      };
   }

   return state;
};
