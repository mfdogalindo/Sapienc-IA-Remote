import { Message } from 'server/models';
import { database } from '../firebase/firebase.server';
import { ref, set, push, get, update } from 'firebase/database';

export async function getChats(projectId: string) {
  const chats = await get(ref(database, `projects/${projectId}/chats`));
  if (!chats.exists()) {
    return [];
  }
   return Object.keys(chats.val()).map((key) => {
      return { id: key, ...chats.val()[key] };
   });
}

export async function createChat(projectId: string, data: any) {
  const chatRef = ref(database, `projects/${projectId}/chats`);
  const newChatRef = push(chatRef);
  const newChat = { id: newChatRef.key, ...data, createdAt: Date.now(), updatedAt: Date.now() };
  await set(newChatRef, newChat);
  return newChat;
}

export async function deleteChat(projectId: string, chatId: string) {
  await set(ref(database, `projects/${projectId}/chats/${chatId}`), null);
}

export async function sendMessage(projectId: string, chatId: string, data: Message) {
  const chatRef = ref(database, `projects/${projectId}/chats/${chatId}/messages`);
  const newMessageRef = push(chatRef);
  const newMessage = { id: newMessageRef.key, ...data, createdAt: Date.now() };
  await set(newMessageRef, newMessage);
  return newMessage;
}  

export async function getChat(projectId: string, chatId: string) {
  const chat = await get(ref(database, `projects/${projectId}/chats/${chatId}`));
  return { id: chatId, ...chat.val() };
}