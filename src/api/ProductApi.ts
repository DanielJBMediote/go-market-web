import { ProductKeys } from "@/hooks/products/filters";
import { AxiosResponse } from "axios";
import { api } from ".";
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

class ProductApi extends BaseApi<ProductBody> {
  async fetchAll(where = new Where()) {
    return await api.get<IProductApi[]>(`/products`, { params: { where: where.build() } });
  }
  async fetchAllFeatrued(where: Where<ProductKeys>) {
    return await api.get<IProductApi[]>(`/products/featured`, { params: { where: where.build() } });
  }
  async fetchOneById(id: number) {
    return await api.get<IProductApi>(`/products/${id}`);
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
    return await api.post(`/products`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // else {
    //   return await api.post(`/products`, body);
    // }
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

    return await api.put(`/products/${productId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  async delete(id: number): Promise<AxiosResponse> {
    return await api.delete(`/products/${id}`);
  }

  async createComment(id: number, comment: string) {
    return await api.post<IProductCommentApi>(`/products/${id}/comment`, comment);
  }

  async updateComment(id: number, productCommentId: number, comment: string) {
    return await api.put<IProductCommentApi>(
      `/products/${id}/comment/${productCommentId}`,
      comment
    );
  }

  async fetchComments(id: number) {
    return await api.get<IProductCommentApi[]>(`/products/${id}/comment`);
  }

  async markSelecteAsFeatured(prodIds: number[]) {
    return await api.put(`/products/mark-as-featured`, prodIds);
  }
}

export const ProductInstaceApi = new ProductApi();
