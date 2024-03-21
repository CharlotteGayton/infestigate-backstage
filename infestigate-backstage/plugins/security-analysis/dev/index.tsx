import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { securityAnalysisPlugin, SecurityAnalysisPage } from '../src/plugin';

createDevApp()
  .registerPlugin(securityAnalysisPlugin)
  .addPage({
    element: <SecurityAnalysisPage />,
    title: 'Root Page',
    path: '/security-analysis',
  })
  .render();
