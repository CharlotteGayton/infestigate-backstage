export interface Config {
    endjinSbom: {
        /**
         * The storage account in which SBOM data is stored.
         * @visibility frontend
         */
        storageAccountName: string;

        /**
         * The container in the storage account in which SBOM data is stored.
         * @visibility frontend
         */
        storageContainer: string;

        /**
         * The path to the SBOM summary scores file.
         * @visibility frontend
         */
        summaryFilePath: string;

        /**
         * The path to the SBOM rejected components scores file.
         * @visibility frontend
         */
        rejectedComponentsFilePath: string;

        /**
         * The path to the SBOM rejected components scores file.
         * @visibility frontend
         */
        unknownComponentsFilePath: string;
    }
}