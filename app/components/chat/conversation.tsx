import { Chat } from "server/models";
import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import { Form } from "@remix-run/react";

export default function Conversation({ chat, projectId }: { chat: Chat; projectId: string }) {
   return (
      <div>
         <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {chat?.messages &&
               Object.values(chat.messages).map((message) => (
                  <div
                     key={message.id}
                     className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                     <div
                        className={`p-2 rounded-lg ${
                           message.sender === "user"
                              ? "bg-teal-500 bg-opacity-70 text-white"
                              : "bg-white bg-opacity-70 text-black"
                        }`}
                     >
                        {message.text}
                     </div>
                  </div>
               ))}
         </div>

         <Form method="post" className="flex gap-2">
            <input type="hidden" name="_action" value="sendMessage" />
            <input type="hidden" name="projectId" value={projectId} />
            <input type="hidden" name="chatId" value={chat.id} />
            <input type="hidden" name="sender" value="user" />
            <input
               type="text"
               id="text"
               name="text"
               required
               className="flex-1 p-2 rounded-lg bg-white bg-opacity-70 text-black focus:outline-none"
               placeholder="Type your message..."
            />
            <button type="submit">
               <PaperAirplaneIcon className="h-4 w-4" />
            </button>
         </Form>
      </div>
   );
}
