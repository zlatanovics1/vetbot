"use client";

import { useState } from "react";
import SendMessage from "./SendMessage";
import { Message } from "@/types";
import RenderMessages from "./RenderMessages";
import { startStreamingResponse } from "@/services/ai-chat";
import { handleError } from "@/utils";
import { useScrollToBottom } from "@/hooks/useScrollToBottom";

export default function Chat() {
  const [containerRef, endRef] = useScrollToBottom<HTMLDivElement>();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI veterinary assistant. How can I help you today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);

  const addMessageChunk = (chunk: string) => {
    setMessages((prev) => {
      const lastMessage = prev[prev.length - 1];
      if (!lastMessage || lastMessage.role !== "assistant") {
        return [...prev, { role: "assistant", content: chunk }];
      }
      return [
        ...prev.slice(0, -1),
        { ...lastMessage, content: lastMessage.content + chunk },
      ];
    });
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  const handleSendMessage = async (message: string) => {
    try {
      setMessages((prev) => [...prev, { role: "user", content: message }]);
      setIsLoading(true);
      await startStreamingResponse(
        message,
        addMessageChunk,
        setChatId,
        chatId,
        stopLoading
      );
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]" ref={containerRef}>
      <RenderMessages
        messages={messages}
        isLoading={isLoading}
        chatId={chatId}
      />
      <SendMessage onSend={handleSendMessage} isLoading={isLoading} />
      <div ref={endRef} className="h-0" />
    </div>
  );
}
