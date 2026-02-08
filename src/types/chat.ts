type Chat = {
  id: string;
  title: string;
  createdAt: number;
  pageUrl?: string;
  domain?: string;
  messages: MessageChannel[];
};

type MessageChannel = {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

export type StorageShape = {
  chats: Chat[];
};
