import { api, CustomResponse } from ".";
import { BaseApi, IBaseObjectApi } from "./Api";
import { ICuponApi } from "./CuponApi";
import { IProductApi } from "./ProductApi";
import { IUserApi } from "./UserApi";
import { Where } from "./Where";

export enum PaymentMethod {
  CASH = "CASH",
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
}

export enum OrderStatus {
  PENDING = "Pending", // Pedido criado, aguardando pagamento
  PROCESSING = "Processing", // Pagamento confirmado, preparando para envio
  SHIPPED = "Shipped", // Pedido enviado/em transporte
  DELIVERED = "Delivered", // Pedido entregue ao cliente
  CANCELLED = "Canceled", // Pedido cancelado (pelo cliente ou sistema)
  REFUNDED = "Refunded", // Reembolsado (para casos de devolução)
  FAILED = "Failed", // Falha no processamento (ex: pagamento recusado)
  COMPLETED = "Completed", // Pedido concluído
}

export type OrderStatusKey = keyof typeof OrderStatus;

export interface IOrderItemApi extends IBaseObjectApi {
  order: IOrderApi;
  product: IProductApi;

  quantity: number;
  unitPrice: number;
}

export interface IOrderApi extends IBaseObjectApi {
  items: IOrderItemApi[];
  client: IUserApi;

  uuid: string;
  taxes: number;
  discount: number;
  totalAmount: number;
  status: OrderStatusKey;
  paymentMethod: PaymentMethod;
  cupon: ICuponApi | null;

  shippingAddress: string;
  paymentDate: Date;
  deliveryDate: Date;
}

export type OrderItemBody = Omit<
  IOrderItemApi,
  "id" | "createdAt" | "updatedAt" | "order" | "quantity" | "unitPrice"
>;

export interface OrderBody
  extends Omit<
    IOrderApi,
    | "id"
    | "createdAt"
    | "updatedAt"
    | "status"
    | "uuid"
    | "client"
    | "deliveryDate"
    | "paymentDate"
    | "items"
  > {
  client: {
    id: number;
  };
  items: OrderItemBody[];
}

class OrderApi extends BaseApi<OrderBody, IOrderApi> {
  async create(body: OrderBody) {
    const response = await api.post<CustomResponse<IOrderApi>>(`/orders`, body);
    const { data } = response;
    return data;
  }
  async fetchAll(where = new Where()) {
    const response = await api.get<CustomResponse<IOrderApi[]>>(`/orders`, {
      params: { where: where.build() },
    });
    const { data } = response;
    return data;
  }
  async fetchOneById(id: number) {
    const response = await api.get<CustomResponse<IOrderApi>>(`/orders/${id}`);
    const { data } = response;
    return data;
  }
  async update(id: number, body: OrderBody) {
    const response = await api.put<CustomResponse<IOrderApi>>(`/orders/${id}`, body);
    const { data } = response;
    return data;
  }
  async updateStatus(orderId: number) {
    const response = await api.get<CustomResponse<null>>(`/orders/${orderId}/update-status`);
    const { data } = response;
    return data;
  }
  async cancelOrder(orderId: number) {
    const response = await api.get<CustomResponse<null>>(`/orders/${orderId}/cancel`);
    const { data } = response;
    return data;
  }
  async delete(id: number) {
    const response = await api.delete<CustomResponse<null>>(`/orders/${id}`);
    const { data } = response;
    return data;
  }
}

export const OrderInstanceApi = new OrderApi();
