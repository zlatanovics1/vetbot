import Loader from "./Loader";
import { Markdown } from "./markdown";
import { Message } from "@/types";

export default function RenderMessages({
  messages,
  isLoading,
}: {
  messages: Message[];
  isLoading: boolean;
}) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages
        .filter((message) => message.content)
        .map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-800 rounded-bl-none"
              }`}
            >
              {message.role === "user" ? (
                message.content
              ) : (
                <Markdown>{message.content}</Markdown>
              )}
            </div>
          </div>
        ))}
      {isLoading && <Loader />}
    </div>
  );
}
