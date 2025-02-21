import { createChat, getChats, deleteChat, sendMessage, getChat } from "server/database/chats-db.server";
import { requireUser } from "server/session.server";
import ChatPage from "~/components/chat/Chat";

export async function loader({ request }: { request: Request }) {
   await requireUser(request);
   const url = new URL(request.url);
   const projectId = url.searchParams.get("projectId");
   const chatId = url.searchParams.get("chatId");

   if (!projectId) {
      return { chats: [] };
   }

   if (chatId) {
      const chat = await getChat(projectId, chatId);
      return { success: true, chat };
   }

   const chats = await getChats(projectId);

   return { success: true, chats };
}

export async function action({ request }: { request: Request }) {
   await requireUser(request);
   const formData = await request.formData();
   const action = formData.get("_action");
   const projectId = formData.get("projectId") as string;

   if (action === "create") {
      const data = {
         name: formData.get("name") as string,
         system: formData.get("system") as string
      };
      const newChat = await createChat(projectId, data);      
      // Create project
      return { success: true, newChat };
   }

   if (action === "delete") {
      const chatId = formData.get("chatId") as string;
      await deleteChat(projectId, chatId);
      console.log("Deleted chat", chatId);
      return { success: true, deletedChatId: chatId };
   }

   if (action === "sendMessage") {
      const chatId = formData.get("chatId") as string;
      const message = {
         text: formData.get("text") as string,
         sender: formData.get("sender") as string,
         createdAt: Date.now()
      };
      const newMessage = await sendMessage(projectId, chatId, message);
      return { success: true, newMessage };
   }
}

export default ChatPage;