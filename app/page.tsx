import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { HumanControl } from "@/components/sections/HumanControl";
import { PilotProgram } from "@/components/sections/PilotProgram";
import { PositioningStrip } from "@/components/sections/PositioningStrip";
import { Problem } from "@/components/sections/Problem";
import { ResponsibleTechnology } from "@/components/sections/ResponsibleTechnology";
import { Solution } from "@/components/sections/Solution";
import { UseCases } from "@/components/sections/UseCases";
import { Workflow } from "@/components/sections/Workflow";

export default function Home() {
  return (
    <main id="inhalt" className="flex-1">
      <Hero />
      <PositioningStrip />
      <Problem />
      <Solution />
      <Workflow />
      <UseCases />
      <HumanControl />
      <ResponsibleTechnology />
      <PilotProgram />
      <Contact />
    </main>
  );
}
