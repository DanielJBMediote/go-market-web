import { api } from ".";
import { IBaseObjectApi } from "./Api";

export interface IFileApi extends IBaseObjectApi {
  name: string;
  uuid: string;
  size: number;
  ext: string;
  type: string;
  data: Blob;
}

export type IArchiveDataCreate = Omit<IFileApi, "id" | "createdAt" | "updatedAt" | "uuid">;

class FileApi {
  async create(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return await api.post<IFileApi>("/files", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async createMultiple(files: FileList) {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]); // 'archives' é o nome do campo no backend
    }
    return await api.post<IFileApi[]>("/files/multiple", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async update(arhciveId: number, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return await api.put<IFileApi>(`/files/${arhciveId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  // updatedMultiple(archives: IArchiveApi[]) {}

  async deleteAll(archives: IFileApi[]) {
    return await api.delete(`/files/multiple`, {
      data: { archivesIds: archives.map((archive) => archive.id) },
    });
  }

  async getImage(uuid: string) {
    return await api.get(`/files/${uuid}`, { responseType: "blob" });
  }
}

export const FileInstanceApi = new FileApi();
