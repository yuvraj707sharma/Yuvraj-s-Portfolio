import "./styles.css";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { GridBackground } from "@/components/ui/grid-background";

import { ComputerScreen } from "./components/computer-screen";
import { Scene } from "./components/scene";

const BasicUI = () => (
  <>
    <Header />
    <GridBackground className="bg-codrops" />
    <ComputerScreen />
    <Scene />
    <Footer />
  </>
);

export default BasicUI;
