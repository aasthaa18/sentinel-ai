import { apiRequest } from "./api"
import type { ChatGatewayResponse } from "../types"

export const chatService = {
  send: (message: string) =>
    apiRequest<ChatGatewayResponse>("/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
}
