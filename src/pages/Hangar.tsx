import HardwareDeck from "../components/store/HardwareDeck";

/** Hangar — home AI computers (Operator's Rig). Old 30-bay workbench lives at /workbench. */
export default function Hangar() {
  return <HardwareDeck mission="home" />;
}
