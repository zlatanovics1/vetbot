"use client";

import { useState } from "react";
import SendMessage from "./SendMessage";
import { Message } from "@/types";
import RenderMessages from "./RenderMessages";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI veterinary assistant. How can I help you today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setIsLoading(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm a simulated response. **In the future**, I'll connect to a real AI service to provide veterinary advice.",
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <RenderMessages messages={messages} isLoading={isLoading} />
      <SendMessage onSend={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
