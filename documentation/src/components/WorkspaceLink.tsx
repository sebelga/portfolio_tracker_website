import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { workspaceUrl } from "@site/src/constants";

export default function WorkspaceLink({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { siteConfig } = useDocusaurusContext();
  const url = (siteConfig.customFields as any)?.workspaceUrl || workspaceUrl;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {children ?? url}
    </a>
  );
}
