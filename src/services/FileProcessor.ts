import { TFile, App } from 'obsidian';
import { PROCESSED_TAG, NOT_PROCESSED_TAG } from '../constants';

export class FileProcessor {
    constructor(private app: App) {}

    async isUnprocessed(file: TFile): Promise<boolean> {
        const cache = this.app.metadataCache.getFileCache(file);
        if (!cache) return true; // If no cache, consider unprocessed

        const tags = cache.tags?.map(t => t.tag) || [];
        const hasProcessedTag = tags.includes(PROCESSED_TAG);
        const hasNotProcessedTag = tags.includes(NOT_PROCESSED_TAG);

        return hasNotProcessedTag || !hasProcessedTag;
    }

    async markProcessed(file: TFile): Promise<void> {
        let content = await this.app.vault.read(file);
        const cache = this.app.metadataCache.getFileCache(file);
        const tags = cache?.tags?.map(t => t.tag) || [];
        
        // If already processed, do nothing
        if (tags.includes(PROCESSED_TAG)) {
            return;
        }

        if (tags.includes(NOT_PROCESSED_TAG)) {
            content = content.replace(NOT_PROCESSED_TAG, PROCESSED_TAG);
        } else {
            const lines = content.split('\n');
            if (lines[0].startsWith('#')) {
                lines[0] += ' ' + PROCESSED_TAG;
            } else {
                lines.unshift(PROCESSED_TAG);
            }
            content = lines.join('\n');
        }
        
        await this.app.vault.modify(file, content);
    }

    async markUnprocessed(file: TFile): Promise<void> {
        let content = await this.app.vault.read(file);
        const cache = this.app.metadataCache.getFileCache(file);
        const tags = cache?.tags?.map(t => t.tag) || [];
        
        // If already unprocessed or doesn't have processed tag, do nothing
        if (tags.includes(NOT_PROCESSED_TAG) || !tags.includes(PROCESSED_TAG)) {
            return;
        }

        content = content.replace(PROCESSED_TAG, NOT_PROCESSED_TAG);
        await this.app.vault.modify(file, content);
    }
} 