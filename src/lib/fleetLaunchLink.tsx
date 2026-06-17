import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

type FleetLaunchLinkProps = {
  launchUrl: string;
  children: ReactNode;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

/** Renders internal routes as React Router links and external URLs as anchors. */
export function FleetLaunchLink({ launchUrl, children, ...rest }: FleetLaunchLinkProps) {
  if (launchUrl.startsWith("/")) {
    return (
      <Link to={launchUrl} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a href={launchUrl} {...rest}>
      {children}
    </a>
  );
}
