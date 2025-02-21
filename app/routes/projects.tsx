import { json } from "@remix-run/node";
import { requireUser } from "server/session.server";
import { getProjects, deleteProject, createProject, updateProject } from "server/database/projects-db.server";
import { ProjectCreate } from "server/models";
import ProjectPage from "~/components/projects/Projects";


export async function loader({ request }: { request: Request }) {
   await requireUser(request);
   const projects = await getProjects();
   return json(projects);
}

export async function action({ request }: { request: Request }) {
   const formData = await request.formData();
   const action = formData.get("_action");

   if (action === "create") {
      const data: ProjectCreate = {
         name: formData.get("name") as string,
         description: formData.get("description") as string,
         objective: formData.get("objective") as string,
      };
      await createProject(data);
      return json({ success: true });
   }

   if (action === "edit") {
      const projectId = formData.get("projectId") as string;
      const data: ProjectCreate = {
         name: formData.get("name") as string,
         description: formData.get("description") as string,
         objective: formData.get("objective") as string,
      };
      await updateProject(projectId, data);
      return json({ success: true });
   }

   if (action === "delete") {
      const projectId = formData.get("projectId") as string;
      console.log("Deleting project", projectId);
      await deleteProject(projectId);
      return json({ success: true });
   }

   return json({ success: false });
}


export default ProjectPage;