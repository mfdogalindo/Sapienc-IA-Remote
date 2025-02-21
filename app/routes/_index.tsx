import { redirect } from "@remix-run/node";
import { getUserSession } from "server/session.server";
import LoginPage from "~/components/Login";

export async function loader({ request }) {
   const user = await getUserSession(request);
   if (user) return redirect("/projects");
   return null;
}

export default LoginPage;
