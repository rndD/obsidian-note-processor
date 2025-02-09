import { TFile, App } from 'obsidian';
import { PROCESSED_TAG, NOT_PROCESSED_TAG } from '../constants';

export class FileProcessor {
    constructor(private app: App) {}

    async isUnprocessed(file: TFile): Promise<boolean> {
        const content = await this.app.vault.read(file);
        const lines = content.split('\n').slice(0, 5); // Get the first 5 lines
        const hasNotProcessedTag = content.includes(NOT_PROCESSED_TAG);
        const lacksProcessedTag = !lines.some(line => line.includes(PROCESSED_TAG));
        return hasNotProcessedTag || lacksProcessedTag;
    }

    async markProcessed(file: TFile): Promise<void> {
        let content = await this.app.vault.read(file);
        
        if (content.includes(NOT_PROCESSED_TAG)) {
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
        content = content.replace(PROCESSED_TAG, NOT_PROCESSED_TAG);
        await this.app.vault.modify(file, content);
    }
} 