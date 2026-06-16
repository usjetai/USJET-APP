import { Navigate } from "react-router-dom";
import { GAMING_ROUTE } from "../data/gamingPortal";

/** Legacy route — Gamer-AI portal lives at /gaming. */
export default function Gamers() {
  return <Navigate to={GAMING_ROUTE} replace />;
}
