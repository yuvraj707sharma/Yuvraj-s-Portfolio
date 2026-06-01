import { CanvasUiDiagram } from "@/components/diagrams/canvasui-diagram";
import { CaseStudyPage } from "@/components/projects/case-study-page";
import { getCaseStudyProject } from "@/lib/projects";

export const metadata = {
  title: "CanvasUI Case Study | Yuvraj Sharma",
  description: "Problem, architecture, and outcomes for CanvasUI.",
};

const project = getCaseStudyProject("canvasui");

const CanvasUiCaseStudyPage = () => {
  if (!project) {
    return null;
  }

  return <CaseStudyPage project={project} diagram={<CanvasUiDiagram />} />;
};

export default CanvasUiCaseStudyPage;
