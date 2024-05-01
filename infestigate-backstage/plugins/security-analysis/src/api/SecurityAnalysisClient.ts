import { OAuthApi } from '@backstage/core-plugin-api';
import { Config } from '@backstage/config';
import { SbomComponent, SecurityAnalysisApi, EntitySbomScoreSummary, EntityVulnerabilityReport } from './types';
import {
  DataLakeServiceClient, StorageSharedKeyCredential
} from '@azure/storage-file-datalake';
import { parse } from 'csv-parse/sync';
import { BackstageAuthApiTokenCredential } from './BackstageAuthApiTokenCredential';
import path from 'path';
import * as fs from "fs";
import { readFileSync } from "fs"

export interface SecurityAnalysisClientOptions {
  authApi: OAuthApi;
  config: Config;
}

export class SecurityAnalysisClient implements SecurityAnalysisApi {
  private readonly authApi: OAuthApi;
  private readonly config: Config;

  constructor(options: SecurityAnalysisClientOptions) {
    this.authApi = options.authApi;
    this.config = options.config;
  }

  /**
   * Gets the SBOM summary for a single entity based on its repo name.
   * 
   * @param repoName The name of the repo for the entity. This will have come from the `endjin.com/sbom-repo-name` annotation in the manifest file.
   * @returns An EntitySbomScoreSummary object containing the summary of accepted/unknown/rejected component licences.
   */
  public async getEntitySummary(): Promise<EntitySbomScoreSummary | undefined> {
    const content = await this.getContentFromDataLakeSummary("/summary_report.json");

    return content;
  }
  
  public async getVulnerabilityReport(): Promise<EntityVulnerabilityReport[] | undefined> {
    const content = await this.getContentFromDataLakeVulnerability("/vulnerability_report_simplified.json");

    console.log(content);

    return content;
  }

  private async getContentFromDataLakeSummary(fileName: string): Promise<EntitySbomScoreSummary> {

    const response = await fetch(fileName);
    const fileContent = await response.json() as EntitySbomScoreSummary;

    return fileContent;
  }
  private async getContentFromDataLakeVulnerability(fileName: string): Promise<EntityVulnerabilityReport[]> {

    const response = await fetch(fileName).then(data => data.json());

    console.log(response);

    const fileContent = response as EntityVulnerabilityReport[];

    console.log(fileContent);

    return fileContent;
  }
}
