import { requireUser } from "server/session.server";

export async function action({ request }: { request: Request }) {
   await requireUser(request);
   const formData = await request.formData();
   const projectId = formData.get("projectId") as string;
   const command = formData.get("command") as string;

   console.log("Command: ", command);

   if (command === "publish") {
      const data = JSON.parse(formData.get("data") as string);
      console.log("Publishing command: ", command, data);
      return  {success: true };
   }

   return { success: false };

}