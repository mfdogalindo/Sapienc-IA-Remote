import { ChevronDown } from "lucide-react";
import { use } from "marked";
import { useEffect, useRef, useState } from "react";
import { Chat } from "server/models";

interface ChatListProps {
   chats: Chat[];
   currentChat?: Chat;
   onChatSelect: (chat?: Chat) => void;
}

export default function ChatList({ chats, currentChat, onChatSelect }: ChatListProps) {
   const [isOpen, setIsOpen] = useState(false);
   const [selectedChat, setSelectedChat] = useState<Chat>();
   const dropdownRef = useRef(null);

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   useEffect(() => {
      const result = chats.find((chat) => chat?.id === currentChat?.id) ?? undefined;
      setSelectedChat(result);
   }, [chats, currentChat]);

   const handleSelect = (chat: Chat) => {
      setSelectedChat(chat);
      onChatSelect(chat);
      setIsOpen(false);
   };

   return (
      <div className="relative w-full" ref={dropdownRef}>
         {/* Botón principal */}
         <button
            className="w-full bg-transparent text-white p-2 flex justify-between items-center border border-teal-900"
            onClick={() => setIsOpen(!isOpen)}
         >
            <span>{selectedChat?.name ?? "Select or create a Chat"}</span>
            <ChevronDown className={`transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
         </button>

         {/* Lista desplegable */}
         {isOpen && (
            <div className="absolute w-full z-10 mt-1 bg-teal-900 shadow-lg">
               {chats.map((chat) => (
                  <div
                     key={chat.id}
                     className="p-2 cursor-pointer text-white hover:bg-teal-800 transition-colors duration-150"
                     onClick={() => handleSelect(chat)}
                  >
                     {chat.name}
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}
