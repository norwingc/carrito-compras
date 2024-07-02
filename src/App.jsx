import { useState, useEffect } from "react";

import Header from "./components/Header";
import Guitar from "./components/Guitar";

import { db } from "./data/db";

function App() {
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

  return (
    <>
      <Header
        cart={cart}
        removeFromCart={removeFromCart}
        increasedQuantity={increasedQuantity}
        decreasedQuantity={decreasedQuantity}
        clearCart={clearCart}
      />

      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {data.map((guitar) => (
            <Guitar guitar={guitar} key={guitar.id} adToCart={adToCart} />
          ))}
        </div>
      </main>

      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0 ">
            GuitarLA - Todos los derechos Reservados
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
