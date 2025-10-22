import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { templateUrl } from '@site/src/constants';

export default function TemplateLink({ children }: { children?: React.ReactNode }) {
  const { siteConfig } = useDocusaurusContext();
  const url = (siteConfig.customFields as any)?.templateUrl || templateUrl;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {children ?? url}
    </a>
  );
}
