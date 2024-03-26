import { OAuthApi } from '@backstage/core-plugin-api';
import { Config } from '@backstage/config';
import { SbomComponent, SecurityAnalysisApi, EntitySbomScoreSummary } from './types';
import {
  DataLakeServiceClient, StorageSharedKeyCredential
} from '@azure/storage-file-datalake';
import { parse } from 'csv-parse/sync';
import { BackstageAuthApiTokenCredential } from './BackstageAuthApiTokenCredential';

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
  public async getEntitySummary(repoName: string): Promise<EntitySbomScoreSummary | undefined> {
    const content = await this.getContentFromDataLake('summaryFilePath')

    return getEntitySbomScores(content, repoName);
  }

  /**
   * Gets the list of unknown components for a single entity.
   * 
   * @param repoName The name of the repo for the entity. This will have come from the `endjin.com/sbom-repo-name` annotation in the manifest file.
   * @returns A list of SbomComponents.
   */
  // public async getEntityUnknownComponents(repoName:string): Promise<SbomComponent[]> {
  //   const unknownComponentsContent = await this.getContentFromDataLake('unknownComponentsFilePath');
  //   return getEntitySbomComponents(unknownComponentsContent, repoName);
  // }

  /**
   * Gets the list of rejected components for a single entity.
   * 
   * @param repoName The name of the repo for the entity. This will have come from the `endjin.com/sbom-repo-name` annotation in the manifest file.
   * @returns A list of SbomComponents.
   */
  // public async getEntityRejectedComponents(repoName:string): Promise<SbomComponent[]> {
  //   const rejectedComponentsContent = await this.getContentFromDataLake('rejectedComponentsFilePath');
  //   return getEntitySbomComponents(rejectedComponentsContent, repoName);  
  // }

  /**
   * Gets the overview summary for all known components.
   * 
   * @returns A list of EntitySbomScoreSummary.
   */
  public async getOverviewSummary(): Promise<EntitySbomScoreSummary[]> {
    const content = await this.getContentFromDataLake('summaryFilePath')

    return getRepoSbomScoresOverview(content);
  }

  private async getContentFromDataLake(fileName: string): Promise<string> {
    const url : string = `https://${this.config.get('endjinSbom.storageAccountName')}.dfs.core.windows.net`;
    const dataLakeServiceClient = new DataLakeServiceClient(url, new BackstageAuthApiTokenCredential(this.authApi));
    const fileSystemClient = dataLakeServiceClient.getFileSystemClient(this.config.get('endjinSbom.storageContainer'));
    const fileString = `endjinSbom.${fileName}`;
    const fileClient = fileSystemClient.getFileClient(this.config.get(fileString));
    const downloadResponse = await fileClient.read();
    const contentBlob = await downloadResponse.contentAsBlob!;
    return await contentBlob.text();
  }
}

function getEntitySbomScores(rawData: string, repoName: string): EntitySbomScoreSummary | undefined {
  const parsedData = parse(rawData, { columns: true, objname: 'repo_name' });

  const scores = parsedData ? parsedData[repoName] : undefined;

  if (scores) {
    return {
      Undefined: scores.Undefined,
      Low: scores.Low,
      Moderate: scores.Moderate,
      High: scores.High,
      Critical: scores.Critical 
    };
  }
    
  return undefined;
}

function getEntitySbomComponents(rawData: string, repoName: string): SbomComponent[] {
  const parsedData = parse(rawData, { columns: true });
  const components = parsedData.filter((option: { [key: string]: string }) => option.repo_name === repoName);

  if (components) {
    const result = parsedData
      .filter((option: { repo_name: any; }) => option.repo_name === repoName)
      .map((option: { Name: any; License: any; CopyrightNotice: any; }) => ({
        componentName: option.Name,
        license: option.License,
        copyright: option.CopyrightNotice
      }));
    return result;
  }

  return [];
}

function getRepoSbomScoresOverview(rawData: string): EntitySbomScoreSummary[] {
  const parsedData = parse(rawData, { columns: true });

  if (parsedData) {
    const result = parsedData
      .map((option: { Undefined: any; Low: any; Moderate: any; High: any; Critical: any;}) => ({
        undefined: option.Undefined,
        low: option.Low,
        moderate: option.Moderate,
        high: option.High,
        critical: option.Critical
      }));

    return result;
  }

  return [];
}