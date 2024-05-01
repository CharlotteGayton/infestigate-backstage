import { createApiRef } from "@backstage/core-plugin-api";

export interface EntitySbomScoreSummary {
  Undefined: number;
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

export interface EntityVulnerabilityReport {
  VulnerabilityID: String;
  PkgID: String;
  PkName: String
  InstalledVersion: String; 
  FixedVersion: String; 
  SeveritySource: String;
  PrimaryURL: String;
  Title: String;
  Description: String;
  Severity: String;
  CweIDs: Array<String>;
  sbom_name: String;
}

export interface SecurityAnalysisApi {
  getEntitySummary(): Promise<EntitySbomScoreSummary | undefined>
  getVulnerabilityReport(): Promise<EntityVulnerabilityReport[] | undefined>
}

export const securityAnalysisApiRef = createApiRef<SecurityAnalysisApi>({
    id: 'plugin.endjin-sbom-analysis.api'
});