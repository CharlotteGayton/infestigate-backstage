import { Entity } from '@backstage/catalog-model';

// export const ANNOTATION_ENDJIN_SBOM_REPO_NAME = 'endjin.com/sbom-repo-name'

// export const getRawSbomRepoName = (entity: Entity) => entity.metadata.annotations?.[ANNOTATION_ENDJIN_SBOM_REPO_NAME]?.trim();

// export const isSbomAvailable = (entity: Entity) => Boolean(getRawSbomRepoName(entity));

// export const getSbomRepoName = (entity: Entity) => {
//   if (!isSbomAvailable(entity)) {
//     throw new Error(`Missing Endjin Sbom annotation: ${ANNOTATION_ENDJIN_SBOM_REPO_NAME}`);
//   }

//   return getRawSbomRepoName(entity);
// }