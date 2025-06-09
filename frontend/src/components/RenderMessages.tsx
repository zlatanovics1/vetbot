import { useState } from "react";
import Loader from "./Loader";
import { Markdown } from "./markdown";
import { Message } from "@/types";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { submitFeedback } from "@/services/ai-chat";

export default function RenderMessages({
  messages,
  isLoading,
  chatId,
}: {
  messages: Message[];
  isLoading: boolean;
  chatId: string | null;
}) {
  // if messages.at(-1).role is assistant, and length > 1, and feedback was not given yet, show a feedback button (thumbs up/down)
  const lastMessage = messages.at(-1);
  const [givenFeedback, setGivenFeedback] = useState(false);
  const isAssistant = lastMessage?.role === "assistant";
  const hasMultipleMessages = messages.length > 1;

  const showFeedback = isAssistant && hasMultipleMessages && !givenFeedback;

  const handleFeedback = async (feedback: "positive" | "negative") => {
    setGivenFeedback(true);
    await submitFeedback(chatId!, feedback);
    toast.success("Thank you for your feedback!");
  };

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
      {showFeedback && (
        <div className="flex justify-start gap-2">
          <button
            onClick={() => handleFeedback("positive")}
            className="cursor-pointer hover:text-green-300"
          >
            <ThumbsUpIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleFeedback("negative")}
            className="cursor-pointer hover:text-red-300"
          >
            <ThumbsDownIcon className="w-5 h-5" />
          </button>
        </div>
      )}
      {isLoading && <Loader />}
    </div>
  );
}
