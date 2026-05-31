import { JuBotDiagram } from "@/components/diagrams/jubot-diagram";
import { CaseStudyPage } from "@/components/projects/case-study-page";
import { getCaseStudyProject } from "@/lib/projects";

export const metadata = {
  title: "JUbot Case Study | Yuvraj Sharma",
  description: "Problem, architecture, and outcomes for JUbot.",
};

const project = getCaseStudyProject("jubot");

const JuBotCaseStudyPage = () => {
  if (!project) {
    return null;
  }

  return <CaseStudyPage project={project} diagram={<JuBotDiagram />} />;
};

export default JuBotCaseStudyPage;
