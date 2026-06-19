import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { wrapExternalInCockpit } from "./fleetLaunchUrl";

type FleetLaunchLinkProps = {
  launchUrl: string;
  children: ReactNode;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

/** Internal routes use React Router; external partners route through `/cockpit` (same window). */
export function FleetLaunchLink({ launchUrl, children, ...rest }: FleetLaunchLinkProps) {
  const location = useLocation();

  if (launchUrl.startsWith("/")) {
    return (
      <Link to={launchUrl} {...rest}>
        {children}
      </Link>
    );
  }

  const cockpitUrl = wrapExternalInCockpit(launchUrl, {
    returnTo: location.pathname || "/",
    label: typeof rest.title === "string" ? rest.title : undefined,
  });

  return (
    <Link to={cockpitUrl} {...rest}>
      {children}
    </Link>
  );
}
