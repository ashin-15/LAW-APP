export type View = 'login' | 'chat' | 'upload' | 'repository';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LegalDomain {
  id: string;
  title: string;
  description: string;
  icon: string;
  items: {
    label: string;
    value: string;
  }[];
  statutesCount: number;
  themeColor: string;
}

export interface UploadedDoc {
  id: string;
  title: string;
  content: string;
  sections: string[];
  uploadedAt: Date;
  type: 'file' | 'text';
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}
