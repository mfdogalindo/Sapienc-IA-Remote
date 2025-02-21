import { useEffect, useState } from "react";
import { useProject } from "~/context/ProjectContext";
import { useActionData, useFetcher, useLoaderData } from "@remix-run/react";
import { Chat } from "server/models";
import ChatList from "./chatList";
import Conversation from "./conversation";
import { NewChatModal } from "./newChatModal";
import DeleteChatButton from "./deleteChat";
import { PlusCircleIcon } from "@heroicons/react/20/solid";

export default function ChatPage() {
   const { selectedProject } = useProject();
   const [chats, setChats] = useState<Chat[]>([]);
   const [selectedChat, setSelectedChat] = useState<Chat>();
   const [isNewChat, setIsNewChat] = useState(false);
   const [inSubmit, setInSubmit] = useState(false);
   const loaderData = useLoaderData<{ projectId: string }>();
   const fetcher = useFetcher<{ success: boolean; chats?: Chat[], chat?: Chat }>();
   const action = useActionData<{ success: boolean; newChat: Chat; deletedChatId: string }>();

   const fetchChats = () => {
      fetcher.load(`/chat?projectId=${selectedProject!.id}`);
   };

   // Continous fetch of chat content
   useEffect(() => {
      const interval = setInterval(() => {
         if (selectedChat) {
            fetcher.load(`/chat?projectId=${selectedProject!.id}&chatId=${selectedChat.id}`);
         }
      }, 500);
      return () => clearInterval(interval);
   }, [selectedChat]);

   useEffect(() => {
      if (selectedProject) {
         fetchChats();
      }
   }, [selectedProject]);

   useEffect(() => {
      if (fetcher.data && fetcher.data.success && fetcher.data.chats) {
         setChats(fetcher.data.chats!);
      }

      if(fetcher.data && fetcher.data?.success && fetcher.data?.chat) {
         setSelectedChat(fetcher.data.chat);
      }

      setIsNewChat(false);
   }, [fetcher.data]);

   useEffect(() => {
      if (action?.newChat) {
         setChats((prevChats) => [...prevChats, action.newChat]);
         setSelectedChat(action.newChat);
      }
      if (action?.deletedChatId) {
         setSelectedChat(undefined);
         fetchChats();
      }
   }, [action]);

   return (
      <div className="app-container">
         <div className="mb-2 flex  justify-between items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Chat</h1>
            <ChatList chats={chats} onChatSelect={setSelectedChat} currentChat={selectedChat} />

            {selectedProject && (
               <DeleteChatButton chat={selectedChat!} projectId={selectedProject.id} isSubmitting={inSubmit} />
            )}
            <button className="" onClick={() => setIsNewChat(true)}>
               <PlusCircleIcon className="h-6 w-6  md:h-8 md:w-8  text-teal-500 hover:text-teal-400" />
            </button>
         </div>

         {selectedChat && (
            <>
               <Conversation chat={selectedChat} projectId={selectedProject!.id} />
            </>
         )}

         {isNewChat && (
            <NewChatModal
               onClose={() => setIsNewChat(false)}
               isOpen={isNewChat}
               initialData={{
                  projectId: selectedProject!.id,
                  description: selectedProject!.description,
                  name: selectedProject!.name,
                  objective: selectedProject!.objective,
                  tools: selectedProject!.tools,
               }}
            />
         )}
      </div>
   );
}
