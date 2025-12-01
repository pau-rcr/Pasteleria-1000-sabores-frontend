import api from "./apiClient";
import { ContactPayload } from "@/models/common";

export async function sendContactMessage(payload: ContactPayload): Promise<void> {
  await api.post("/contact", payload);
}
