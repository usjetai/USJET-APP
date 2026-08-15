import HardwareDeck from "../components/store/HardwareDeck";
import HomesHero from "../components/store/HomesHero";

/** Hangar — home AI computers (Operator's Rig). Old 30-bay workbench lives at /workbench. */
export default function Hangar() {
  return (
    <>
      <HomesHero />
      <HardwareDeck mission="home" omitHero />
    </>
  );
}
