import { publishText, getText  } from "server/database/clipboard-db.server";
import { json } from "@remix-run/node";
import { requireUser } from "server/session.server";
import ClipboardPage from "~/components/clipboard/Clipboard";

export async function loader({ request }: { request: Request }) {
  await requireUser(request);
   const initialContent = await getText();
   return json({ content: initialContent });
}

export async function action({ request }: { request: Request }) {
   const formData = await request.formData();
   const text = formData.get("text") as string;
   await publishText(text);
   return json({ success: true });
}

export default ClipboardPage;
