import { IProductApi } from "@/api/ProductApi";
import { SESSION_ITEMS_KEY } from "@/contexts/client-cart-provider";
import { CartItem } from "./reducer";

export enum ClientCartActionTypes {
  ADD = "ADD",
  REMOVE = "REMOVE",
  CLEAR = "CLEAR",
  REPLACE = "REPLACE",
  REMOVE_ALL_OF = "REMOVE_ALL_OF",
}

// Discriminated unions para ações
export type ClientCartActions =
  | { type: ClientCartActionTypes.ADD; payload: { product: IProductApi; quantity: number } }
  | { type: ClientCartActionTypes.REMOVE; payload: number }
  | { type: ClientCartActionTypes.REMOVE_ALL_OF; payload: number }
  | { type: ClientCartActionTypes.REPLACE; payload: CartItem[] }
  | { type: ClientCartActionTypes.CLEAR; payload?: null };

interface AddNewProductOnCartProps {
  previousList: CartItem[];
  product: IProductApi;
  quantity: number;
}

export function addNewProductOnCart({
  previousList,
  product,
  quantity = 1,
}: AddNewProductOnCartProps) {
  const currentList = [...previousList];
  const existingProductIndex = currentList.findIndex((p) => p.product.id === product.id);

  if (existingProductIndex === -1) {
    currentList.push({ product, discont: 0, quantity, taxes: 0 });
  } else {
    const updatedItem = {
      ...currentList[existingProductIndex],
      quantity: currentList[existingProductIndex].quantity + quantity,
    };
    currentList[existingProductIndex] = updatedItem;
  }

  localStorage.setItem(SESSION_ITEMS_KEY, JSON.stringify(currentList));
  return currentList;
}

interface RemoveProductOnCartProps {
  previousList: CartItem[];
  productId: number;
}

export function removeProductFromCart({ previousList, productId }: RemoveProductOnCartProps) {
  const currentList = [...previousList];
  const existingProductIndex = currentList.findIndex((p) => p.product.id === productId);

  if (existingProductIndex !== -1) {
    const existingItem = currentList[existingProductIndex];
    if (existingItem.quantity > 1) {
      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity - 1,
      };
      currentList[existingProductIndex] = updatedItem;
    } else {
      currentList.splice(existingProductIndex, 1);
    }
  }

  localStorage.setItem(SESSION_ITEMS_KEY, JSON.stringify(currentList));
  return currentList;
}

export function removeAllOfProductFromCart({ previousList, productId }: RemoveProductOnCartProps) {
  const currentList = previousList.filter((p) => p.product.id !== productId);
  localStorage.setItem(SESSION_ITEMS_KEY, JSON.stringify(currentList));
  return currentList;
}
