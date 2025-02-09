import { TFile, App } from 'obsidian';
import { FileCache } from '../types/types';
import { FileProcessor } from './FileProcessor';

export class CacheManager {
    private cache: FileCache;
    private fileProcessor: FileProcessor;

    constructor(private app: App) {
        this.cache = {
            processedFiles: new Set(),
            unprocessedFiles: new Set(),
            lastFullScan: 0,
            isReady: false,
            scanProgress: {
                current: 0,
                total: 0
            }
        };
        this.fileProcessor = new FileProcessor(app);
    }

    async performFullScan(): Promise<void> {
        const files = this.app.vault.getMarkdownFiles();
        
        // Clear existing cache and initialize scan
        this.cache.processedFiles.clear();
        this.cache.unprocessedFiles.clear();
        this.cache.isReady = false;
        this.cache.scanProgress = {
            current: 0,
            total: files.length
        };

        // Scan all files
        for (const file of files) {
            await this.updateFileInCache(file);
            this.cache.scanProgress.current++;
        }

        this.cache.lastFullScan = Date.now();
        this.cache.isReady = true;
    }

    async updateFileInCache(file: TFile): Promise<void> {
        const isUnprocessed = await this.fileProcessor.isUnprocessed(file);
        const path = file.path;

        // Remove from both sets first to avoid duplicates
        this.cache.processedFiles.delete(path);
        this.cache.unprocessedFiles.delete(path);

        // Add to appropriate set
        if (isUnprocessed) {
            this.cache.unprocessedFiles.add(path);
        } else {
            this.cache.processedFiles.add(path);
        }
    }

    removeFileFromCache(file: TFile): void {
        const path = file.path;
        this.cache.processedFiles.delete(path);
        this.cache.unprocessedFiles.delete(path);
    }

    getProcessedCount(): number {
        return this.cache.processedFiles.size;
    }

    getUnprocessedCount(): number {
        return this.cache.unprocessedFiles.size;
    }

    getUnprocessedPaths(): string[] {
        return Array.from(this.cache.unprocessedFiles);
    }

    isReady(): boolean {
        return this.cache.isReady;
    }

    getScanProgress(): { current: number; total: number } {
        return this.cache.scanProgress;
    }
} 