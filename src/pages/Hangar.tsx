import HardwareDeck from "../components/store/HardwareDeck";
import RigHero from "../components/store/RigHero";

/** Hangar — home AI computers (Operator's Rig). Old 30-bay workbench lives at /workbench. */
export default function Hangar() {
  return (
    <>
      <RigHero />
      <HardwareDeck mission="home" omitHero />
    </>
  );
}
