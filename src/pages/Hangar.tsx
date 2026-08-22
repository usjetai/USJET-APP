import HardwareDeck from "../components/store/HardwareDeck";
import HomesHero from "../components/store/HomesHero";

/** Hangar — home AI computers (Operator's Rig). */
export default function Hangar() {
  return (
    <>
      <HomesHero />
      <HardwareDeck mission="home" omitHero />
    </>
  );
}
