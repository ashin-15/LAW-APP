/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type View = 'login' | 'chat' | 'upload' | 'repository' | 'processing';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  analysis?: string;
  sources?: string[];
  timestamp: Date;
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
