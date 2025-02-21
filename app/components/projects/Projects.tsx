import { PencilIcon } from "@heroicons/react/16/solid";
import { PlusIcon } from "@heroicons/react/16/solid";
import { useFetcher, useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Project } from "server/models";
import { useProject } from "~/context/ProjectContext";
import DeleteProjectButton from "./DeleteProjectButton";
import { ProjectFiles } from "./ProjectFiles";
import { ProjectFormModal } from "./EditProjectModal";

const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export default function ProjectPage() {
   const fetcher = useFetcher<Project[]>();
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [editingProject, setEditingProject] = useState<Project | null>(null);
   const { selectedProject, setSelectedProject, setIsLoading } = useProject();
   const navigation = useNavigation();

   const loadProjects = async () => {
      setIsLoading(true);
      await fetcher.load(window.location.pathname);
      setIsLoading(false);
   };

   useEffect(() => {
      loadProjects();
   }, []);

   useEffect(() => {
      if (selectedProject && fetcher.data) {
         const projectStillExists = Object.values(fetcher.data).some((project) => project.id === selectedProject.id);
         if (!projectStillExists) {
            setSelectedProject(null);
         }
      }
      if (navigation.state === "idle") {
         setIsLoading(false);
      }
   }, [fetcher.data, selectedProject, setSelectedProject]);

   const handleEditProject = (project: Project) => {
      setEditingProject(project);
      setIsModalOpen(true);
   };

   const handleCloseModal = () => {
      setIsModalOpen(false);
      setIsLoading(true);
      setEditingProject(null);
      if (navigation.state === "idle") {
         loadProjects();
      }
   };

   return (
      <div className="app-container">
         <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl md:text-2xl font-bold text-white">Projects</h1>
            <button
               onClick={() => setIsModalOpen(true)}
               className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            >
               <PlusIcon className="h-5 w-5" />
               New Project
            </button>
         </div>

         {fetcher.data &&
            Object.keys(fetcher.data).map((key) => {
               const project = fetcher.data[key];
               const isSelected = selectedProject?.id === project.id;

               return (
                  <div
                     key={key}
                     className={`grid grid-cols-1 md:grid-cols-2 bg-zinc-400 p-2 bg-opacity-20 mb-4 items-baseline cursor-pointer hover:bg-opacity-30 transition-all ${
                        isSelected ? "border-l-4 border-teal-400" : ""
                     }`}
                     onClick={() => setSelectedProject(project)}
                  >
                     <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-white">{project.name}</h2>
                        <button
                           onClick={() => handleEditProject(project)}
                           className="text-teal-400 hover:text-teal-300 transition-colors"
                        >
                           <PencilIcon className="h-5 w-5" />
                        </button>
                        <DeleteProjectButton
                           project={project}
                           isSubmitting={navigation.state === "submitting"}
                           onDeleteComplete={loadProjects}
                        />
                     </div>
                     <p className="text-xs text-zinc-400 text-right">
                        Created: {new Date(project.createdAt).toLocaleString("es-CO", { timeZone: localTimeZone })}{" "}
                     </p>
                     <p className="md:col-span-2 text-white italic font-serif text-zinc-400">{project.description}</p>
                     <p>
                        Objetive: <span className="italic">{project.objective}</span>
                     </p>
                     <ProjectFiles className="md:col-span-2" files={project.files} projectId={project.id} />
                  </div>
               );
            })}

         <ProjectFormModal isOpen={isModalOpen} onClose={handleCloseModal} initialData={editingProject || undefined} />
      </div>
   );
}
