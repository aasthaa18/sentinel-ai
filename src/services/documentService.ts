import { apiRequest } from "./api"
import type { DocumentRecord } from "../types"

export const documentService = {
  list: () => apiRequest<DocumentRecord[]>("/documents"),
  upload: (file: File) => {
    const form = new FormData()
    form.append("file", file)
    return apiRequest<DocumentRecord>("/documents", {
      method: "POST",
      body: form,
      headers: {},
    })
  },
}
