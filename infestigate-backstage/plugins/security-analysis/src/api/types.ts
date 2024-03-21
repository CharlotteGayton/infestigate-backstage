import { createApiRef } from "@backstage/core-plugin-api"

export interface EntitySbomScoreSummary {
  Undefined: string;
  Low: number;
  Moderate: number;
  High: number;
  Critical: number;
}

export interface SbomComponent {
  name: string;
  license: string;
  copyright: string;
}

export interface EndjinSbomAnalysisApi {
  getEntitySummary(repoName: string): Promise<EntitySbomScoreSummary | undefined>
//   getEntityUnknownComponents(repoName: string): Promise<SbomComponent[]>
//   getEntityRejectedComponents(repoName: string): Promise<SbomComponent[]>

  getOverviewSummary(): Promise<EntitySbomScoreSummary[]>
}

export const endjinSbomAnalysisApiRef = createApiRef<EndjinSbomAnalysisApi>({
  id: 'plugin.endjin-sbom-analysis.api'
});