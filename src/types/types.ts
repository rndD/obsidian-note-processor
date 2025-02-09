export interface FileCache {
    processedFiles: Set<string>;
    unprocessedFiles: Set<string>;
    lastFullScan: number;
    isReady: boolean;
    scanProgress: {
        current: number;
        total: number;
    };
} 