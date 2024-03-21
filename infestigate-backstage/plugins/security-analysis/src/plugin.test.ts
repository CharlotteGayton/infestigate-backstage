import { securityAnalysisPlugin } from './plugin';

describe('security-analysis', () => {
  it('should export plugin', () => {
    expect(securityAnalysisPlugin).toBeDefined();
  });
});
