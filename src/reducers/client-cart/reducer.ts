import { IProductApi } from "@/api/ProductApi";
import { SESSION_ITEMS_KEY } from "@/contexts/client-cart-provider";
import {
  addNewProductOnCart,
  ClientCartActions,
  ClientCartActionTypes,
  removeAllOfProductFromCart,
  removeProductFromCart,
} from "./actions";

export interface CartItem {
  product: IProductApi;
  quantity: number;
  taxes: number;
  discont: number;
}

type State = {
  items: CartItem[];
};

export function clientCartReducer(state: State, action: ClientCartActions): State {
  switch (action.type) {
    case ClientCartActionTypes.REPLACE:
      return {
        ...state,
        items: action.payload,
      };
    case ClientCartActionTypes.ADD:
      return {
        ...state,
        items: addNewProductOnCart({
          previousList: state.items,
          product: action.payload.product,
          quantity: action.payload.quantity,
        }),
      };

    case ClientCartActionTypes.REMOVE:
      return {
        ...state,
        items: removeProductFromCart({
          previousList: state.items,
          productId: action.payload,
        }),
      };
    case ClientCartActionTypes.REMOVE_ALL_OF:
      return {
        ...state,
        items: removeAllOfProductFromCart({
          previousList: state.items,
          productId: action.payload,
        }),
      };

    case ClientCartActionTypes.CLEAR:
      localStorage.setItem(SESSION_ITEMS_KEY, "[]");
      return {
        ...state,
        items: [],
      };

    default:
      return state;
  }
}
