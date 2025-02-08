import RoadFooter from "@/app/components/RoadFooter";
import ProjectSelector from "../../components/project-selector";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#808080] flex flex-col items-center">
      <ProjectSelector />
      <RoadFooter />
    </main>
  );
}
