export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  documentId?: string;
}

export interface Document {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
  type: string;
  url?: string;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  lastActivity: Date;
  documentIds: string[];
  messageCount: number;
  isActive?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'enterprise';
}

export interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Message[];
  documents: Document[];
  isLoading: boolean;
  isTyping: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  popular?: boolean;
}

export type Bin = {
  id: string;
  name: string;
  color: string;
  numOfSpaces: number;
  spaces: Space[];
};

export type Space = {
    spaceId: string;
    spaceName: string;
    binId: string;
    lastUsedNumOfDays: number;
    conversations: Chat[]
    // the chats which are made btw the user and the 
    // if 1 day ago, 2 dayo ago vs 7 days algo etc
}

export type Chat = {
    id: string;
    writtenBy: 'ai' | 'user';
    messageContent: string;
    writtenAtTime: string;
    documentAssociatedName?: string[];
}

