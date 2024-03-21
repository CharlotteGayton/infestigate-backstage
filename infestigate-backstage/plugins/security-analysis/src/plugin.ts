import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const securityAnalysisPlugin = createPlugin({
  id: 'security-analysis',
  routes: {
    root: rootRouteRef,
  },
});

export const SecurityAnalysisPage = securityAnalysisPlugin.provide(
  createRoutableExtension({
    name: 'SecurityAnalysisPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
