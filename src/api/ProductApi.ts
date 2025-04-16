import { ProductKeys } from "@/hooks/products/filters";
import { api, CustomResponse } from ".";
import { BaseApi, IBaseObjectApi } from "./Api";
import { ICategoryApi } from "./CategoryApi";
import { ICommentApi } from "./CommentApi";
import { IFileApi } from "./FileApi";
import { IStoreApi } from "./StoreApi";
import { Where } from "./Where";

export interface IProductFileApi extends IBaseObjectApi {
  product: IProductApi;
  file: IFileApi;
}

export interface IProductCommentApi extends IBaseObjectApi {
  comment: ICommentApi;
  product: IProductApi;
}

export interface IProductApi extends IBaseObjectApi {
  name: string;
  price: number;
  description: string;
  timesOrdered: number;
  isActive: boolean;
  isFeatured: boolean;
  category: ICategoryApi;
  lowestPrice: number;
  likes: number;
  highestPrice: number;
  store: IStoreApi;
  images: IProductFileApi[];
  comments: IProductCommentApi[];
}

interface ProductBody
  extends Omit<
    IProductApi,
    | "id"
    | "createdAt"
    | "updatedAt"
    | "timesOrdered"
    | "lowestPrice"
    | "highestPrice"
    | "store"
    | "likes"
    | "comments"
    | "category"
  > {
  store: Pick<IStoreApi, "id">;
  files: File[];
  category: Pick<ICategoryApi, "id">;
}

class ProductApi extends BaseApi<ProductBody, IProductApi> {
  async fetchAll(where = new Where()) {
    const response = await api.get<CustomResponse<IProductApi[]>>(`/products`, {
      params: { where: where.build() },
    });

    const { data } = response;
    return data;
  }
  async fetchAllFeatrued(where: Where<ProductKeys>) {
    const response = await api.get<CustomResponse<IProductApi[]>>(`/products/featured`, {
      params: { where: where.build() },
    });
    const { data } = response;
    return data;
  }
  async fetchOneById(id: number) {
    const response = await api.get<CustomResponse<IProductApi>>(`/products/${id}`);
    const { data } = response;
    return data;
  }
  async create(body: ProductBody) {
    const formData = new FormData();
    formData.append(
      "data",
      new Blob([JSON.stringify({ ...body, files: [] })], { type: "application/json" })
    );

    if (body.files && body.files.length) {
      body.files.forEach((file) => formData.append("files", file));
    }
    const response = await api.post<CustomResponse<IProductApi>>(`/products`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const { data } = response;
    return data;
  }
  async update(productId: number, body: ProductBody) {
    const formData = new FormData();
    formData.append(
      "data",
      new Blob([JSON.stringify({ ...body })], {
        type: "application/json",
      })
    );

    if (body.files) {
      body.files.forEach((file) => formData.append("files", file));
    }

    const response = await api.put<CustomResponse<IProductApi>>(
      `/products/${productId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const { data } = response;
    return data;
  }
  async delete(id: number) {
    const response = await api.delete<CustomResponse<null>>(`/products/${id}`);
    const { data } = response;
    return data;
  }

  async createComment(id: number, comment: string) {
    const response = await api.post<CustomResponse<IProductCommentApi>>(
      `/products/${id}/comment`,
      comment
    );
    const { data } = response;
    return data;
  }

  async updateComment(id: number, productCommentId: number, comment: string) {
    const response = await api.put<CustomResponse<IProductCommentApi>>(
      `/products/${id}/comment/${productCommentId}`,
      comment
    );
    const { data } = response;
    return data;
  }

  async fetchComments(id: number) {
    const response = await api.get<CustomResponse<IProductCommentApi[]>>(`/products/${id}/comment`);
    const { data } = response;
    return data;
  }

  async markSelecteAsFeatured(prodIds: number[]) {
    const response = await api.put<CustomResponse<null>>(`/products/mark-as-featured`, prodIds);
    const { data } = response;
    return data;
  }
}

export const ProductInstaceApi = new ProductApi();
