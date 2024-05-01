import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  microsoftAuthApiRef,
  configApiRef
} from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';
import { securityAnalysisApiRef } from './api';
import { SecurityAnalysisClient } from './api';

export const securityAnalysisPlugin = createPlugin({
  id: 'security-analysis',
  apis: [
    createApiFactory({
      api: securityAnalysisApiRef,
      deps: {
        authApi: microsoftAuthApiRef,
        config: configApiRef
      },
  factory({ authApi, config }) {
    return new SecurityAnalysisClient({ authApi, config });
    },
  }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

export const SecurityAnalysisPage = securityAnalysisPlugin.provide(
  createRoutableExtension({
    name: 'SecurityAnalysisPage',
    component: () =>
      import('./components/SecurityAnalysisEntityPage').then(m => m.SecurityAnalysisOverviewPageContent),
    mountPoint: rootRouteRef,
  }),
);
