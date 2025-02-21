import { useEffect, useRef } from "react";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Form, useNavigation } from "@remix-run/react";
import { Chat, Project } from "server/models";
import { TrashIcon } from "@heroicons/react/16/solid";

export default function DeleteChatButton({
   projectId,
   chat,
   isSubmitting,
}: {
   projectId: string;
   chat?: Chat;
   isSubmitting: boolean;
}) {
   const formRef = useRef<HTMLFormElement>(null);

   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      const form = e.currentTarget;
      form.setAttribute("data-submitted", "delete");
   };

   if (!chat) {
      return null;
   }

   return (
      <AlertDialog>
         <AlertDialogTrigger asChild>
            <button className="text-red-500 hover:text-red-700 transition-colors">
               <TrashIcon className="h-6 w-6 md:h-8 md:w-8" />
            </button>
         </AlertDialogTrigger>
         <AlertDialogContent className="bg-zinc-900 border border-zinc-800">
            <AlertDialogHeader>
               <AlertDialogTitle className="text-white">Delete Project</AlertDialogTitle>
               <AlertDialogDescription className="text-zinc-400">
                  Are you sure you want to delete "{chat.name}"? This action cannot be undone.
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel className="bg-zinc-800 text-white hover:bg-zinc-700">Cancel</AlertDialogCancel>
               <Form method="post" ref={formRef} onSubmit={handleSubmit}>
                  <input type="hidden" name="_action" value="delete" />
                  <input type="hidden" name="projectId" value={projectId} />
                  <input type="hidden" name="chatId" value={chat.id} />
                  <AlertDialogAction
                     type="submit"
                     disabled={isSubmitting}
                     className="bg-red-600 text-white hover:bg-red-700"
                  >
                     {isSubmitting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
               </Form>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
}
