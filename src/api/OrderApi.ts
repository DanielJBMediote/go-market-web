import { AxiosResponse } from "axios";
import { api } from ".";
import { BaseApi, IBaseObjectApi } from "./Api";
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
  status: OrderStatus;
  paymentMethod: PaymentMethod;

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

class OrderApi extends BaseApi<OrderBody> {
  async create(body: OrderBody): Promise<AxiosResponse> {
    return await api.post<IOrderApi>(`/orders`, body);
  }
  async fetchAll(where = new Where()): Promise<AxiosResponse> {
    return await api.get<IOrderApi[]>(`/orders`, { params: { where: where.build() } });
  }
  async fetchOneById(id: number): Promise<AxiosResponse> {
    return await api.get<IOrderApi>(`/orders/${id}`);
  }
  async update(id: number, body: OrderBody): Promise<AxiosResponse> {
    return await api.put<IOrderApi>(`/orders/${id}`, body);
  }
  async updateStatus(orderId: number) {
    return await api.get(`/orders/${orderId}/update-status`);
  }
  async cancelOrder(orderId: number) {
    return await api.get<IOrderApi>(`/orders/${orderId}/cancel`);
  }
  async delete(id: number): Promise<AxiosResponse> {
    return await api.delete(`/orders/${id}`);
  }
}

export const OrderInstanceApi = new OrderApi();
