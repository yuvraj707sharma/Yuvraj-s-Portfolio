import { VitalBandDiagram } from "@/components/diagrams/vital-band-diagram";
import { CaseStudyPage } from "@/components/projects/case-study-page";
import { getCaseStudyProject } from "@/lib/projects";

export const metadata = {
  title: "Vital Band Case Study | Yuvraj Sharma",
  description: "Problem, architecture, and outcomes for Vital Band.",
};

const project = getCaseStudyProject("vital-band");

const VitalBandCaseStudyPage = () => {
  if (!project) {
    return null;
  }

  return <CaseStudyPage project={project} diagram={<VitalBandDiagram />} />;
};

export default VitalBandCaseStudyPage;
