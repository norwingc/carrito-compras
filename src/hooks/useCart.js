import { useState, useEffect, useMemo } from "react";
import { db } from "../data/db";
export const useCart = () => {
  const initialCart = localStorage.getItem("guitarCart");
  const [cart, setCart] = useState(initialCart ? JSON.parse(initialCart) : []);
  const [data] = useState(db);

  const MAX_ITEMS = 5;
  const MIN_ITEMS = 1;

  useEffect(() => {
    localStorage.setItem("guitarCart", JSON.stringify(cart));
  }, [cart]);

  function adToCart(item) {
    const itemExists = cart.findIndex((cartItem) => cartItem.id === item.id);
    if (itemExists >= 0) {
      if (cart[itemExists].quantity < MAX_ITEMS) {
        const updateCart = [...cart];
        updateCart[itemExists].quantity += 1;
        setCart(updateCart);
      }
    } else {
      item.quantity = 1;
      setCart([...cart, item]);
    }
  }

  function removeFromCart(id) {
    setCart(cart.filter((item) => item.id !== id));
  }

  function increasedQuantity(id) {
    const updateCart = cart.map((item) => {
      if (item.id === id && item.quantity < MAX_ITEMS) {
        item.quantity += 1;
      }
      return item;
    });
    setCart(updateCart);
  }

  function decreasedQuantity(id) {
    const updateCart = cart.map((item) => {
      if (item.id === id && item.quantity > MIN_ITEMS) {
        item.quantity -= 1;
      }
      return item;
    });
    setCart(updateCart);
  }

  function clearCart() {
    setCart([]);
  }

  const isEmpty = useMemo(() => cart.length === 0, [cart]);
  const totalCart = useMemo(
    () => cart.reduce((total, item) => total + item.quantity * item.price, 0),
    [cart]
  );

  return {
    data,
    cart,
    adToCart,
    removeFromCart,
    increasedQuantity,
    decreasedQuantity,
    clearCart,
    isEmpty,
    totalCart,
  };
};
