import { API_URL } from "@/consts";
import { handleError } from "@/utils";

export const startStreamingResponse = async (
  message: string,
  addChunk: (chunk: string) => void,
  setChatId: (id: string) => void
) => {
  try {
    const response = await fetch(`${API_URL}/faq`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ question: message }),
    });

    if (!response.body) {
      throw new Error("Response body is null");
    }

    const reader = response.body.getReader()!;

    const decoder = new TextDecoder();
    // @ts-ignore
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      // {content: "...", id?:""}
      const data = decoder.decode(value);
      const json = JSON.parse(data);
      if (json.id) {
        setChatId(json.id);
      }
      addChunk(json.content);
    }
  } catch (error) {
    handleError(error);
  }
};

export const submitFeedback = async (
  chatId: string,
  feedback: "positive" | "negative"
) => {
  try {
    const response = await fetch(`${API_URL}/faq/feedback`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, feedback }),
    });
    return response.json();
  } catch (error) {
    handleError(error);
  }
};
