import { Chat } from "./Chats.model";

export interface FileMetadata {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: number;
  url?: string;
  path?: string;
}

export interface FileWithMetadata extends FileMetadata {
  data: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  objective: string;
  tools?: string;
  chats: Chat[];
  files: FileMetadata[];
  createdAt: number;
  updatedAt: number;
}


export type ProjectCreate = Partial<Pick<Project, 'name' | 'description' | 'objective'>>;