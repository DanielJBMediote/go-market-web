"use client";

import { IProductApi } from "@/api/ProductApi";
import { ClientCartActionTypes } from "@/reducers/client-cart/actions";
import { CartItem, clientCartReducer } from "@/reducers/client-cart/reducer";
import { createContext, PropsWithChildren, useContext, useEffect, useReducer } from "react";
import { toast } from "sonner";

export const SESSION_ITEMS_KEY = "@go-market:cart-items";

interface State {
  items: CartItem[];
}

interface Actions {
  addItem: (item: IProductApi, quantity: number) => void;
  removeItem: (itemId: number) => void;
  removeAllOfItem: (itemId: number) => void;
  clearCart: () => void;
}

const ClientCartContext = createContext({} as State & Actions);

export function ClientCartProvider({ children }: PropsWithChildren) {
  const [clientCartState, dispatch] = useReducer(clientCartReducer, {
    items: [],
  });

  useEffect(() => {
    const storageItems = localStorage.getItem(SESSION_ITEMS_KEY);
    if (storageItems) {
      try {
        const parsed = JSON.parse(storageItems) as CartItem[];
        dispatch({ type: ClientCartActionTypes.REPLACE, payload: parsed });
      } catch (error) {
        console.error("Erro ao ler o carrinho do localStorage:", error);
      }
    }
  }, []);

  function addItem(product: IProductApi, quantity: number) {
    dispatch({ type: ClientCartActionTypes.ADD, payload: { product, quantity } });
    toast.info(`The product has been added to your shopping cart!`);
  }
  function removeItem(productId: number) {
    dispatch({ type: ClientCartActionTypes.REMOVE, payload: productId });
    toast.info(`The product has been removed from your shopping cart!`);
  }
  function removeAllOfItem(productId: number) {
    dispatch({ type: ClientCartActionTypes.REMOVE_ALL_OF, payload: productId });
    toast.info(`The product has been removed from your shopping cart!`);
  }
  function clearCart() {
    dispatch({ type: ClientCartActionTypes.CLEAR, payload: null });
    toast.info(`Your shopping cart is now empty!`);
  }

  const value: State & Actions = {
    items: clientCartState.items,
    addItem,
    removeItem,
    clearCart,
    removeAllOfItem,
  };

  return <ClientCartContext.Provider value={value}>{children}</ClientCartContext.Provider>;
}

export function useClientCartContext() {
  const context = useContext(ClientCartContext);

  if (!context) {
    throw new Error("Can't resolve useClientCartContext without ClientCartProvider.");
  }

  return context;
}
