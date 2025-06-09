import { API_URL } from "@/consts";
import { handleError } from "@/utils";

export const startStreamingResponse = async (
  message: string,
  addChunk: (chunk: string) => void,
  setChatId: (id: string) => void,
  chatId: string | null,
  stopLoading: () => void
) => {
  try {
    const response = await fetch(
      `${API_URL}/faq${chatId ? `?id=${chatId}` : ""}`,
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ question: message }),
      }
    );

    if (!response.body) {
      throw new Error("Response body is null");
    }

    stopLoading();
    const reader = response.body.getReader()!;

    const decoder = new TextDecoder();
    let buffer = "";
    // @ts-ignore
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // Keep the last incomplete line in the buffer

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const json = JSON.parse(line.slice(6));
            if (json.id) {
              setChatId(json.id);
            }
            if (json.content) {
              addChunk(json.content);
            }
          } catch (e) {
            console.error("Error parsing chunk:", e);
          }
        }
      }
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
