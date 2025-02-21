import { Form, useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

interface NewChatModalProps {
   isOpen: boolean;
   onClose: () => void;
   initialData?: {
      projectId: string;
      description?: string;
      name?: string;
      objective: string;
      tools?: string;
   };
}

export function NewChatModal({ isOpen, onClose, initialData }: NewChatModalProps) {
   const [isEditing, setIsEditing] = useState(false);
   const [isSaving, setIsSaving] = useState(false);
   const [chatName, setChatName] = useState("");
   const navigation = useNavigation();

   useEffect(() => {
      if (navigation.state === "submitting") {
         setIsSaving(true);
      }
   });

   const generateSystemDescription = () => {
      return (
         `##Chat name: ${chatName}\n\n` +
         `## Project: ${initialData?.name}\n\n` +
         `## Objective: ${initialData?.objective}\n\n` +
         `## Tools: \n${initialData?.tools ?? "No tools"}\n\n` +
         `## Project Description:\n${initialData?.description ?? ""}`
      );
   };

   const renderDescription = () => {
      const formattedText = generateSystemDescription()
         .split("\n")
         .map((line, index) => {
            return (
               <p key={index} className="text-sm">
                  {line}
               </p>
            );
         });
      return formattedText;
   };

   return (
      <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
         <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
            <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[450px] bg-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-xl">
               <Dialog.Title className="text-xl font-semibold text-white mb-4">
                  {isEditing ? "Edit Chat" : "Create New Chat"}
               </Dialog.Title>

               <div className="">
                  <p className="text-white mb-1">System context:</p>
                  <output className="bg-zinc-800 p-1 block text-zinc-200 italic">{renderDescription()}</output>
               </div>

               <Form method="post" className="space-y-4">
                  <input type="hidden" name="_action" value={isEditing ? "edit" : "create"} />
                  <input type="hidden" name="projectId" value={initialData?.projectId} />
                  <input type="hidden" name="system" value={generateSystemDescription()} />

                  <div>
                     <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
                        Chat Name
                     </label>
                     <input
                        type="text"
                        id="name"
                        name="name"
                        onChange={(e) => setChatName(e.target.value)}
                        required
                        defaultValue={isEditing ? "chatName" : ""}
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Enter chat name"
                     />
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                     <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-white bg-zinc-800 hover:bg-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
                     >
                        Cancel
                     </button>
                     <button
                        type="submit"
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                     >
                        {isEditing ? "Save Changes" : "Create Chat"}
                     </button>
                  </div>
               </Form>
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   );
}
