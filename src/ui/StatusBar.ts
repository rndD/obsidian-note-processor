import { Plugin } from 'obsidian';

export class StatusBar {
    private statusBarItem: HTMLElement;
    private lastProcessedCount: number = -1;
    private lastUnprocessedCount: number = -1;
    private lastScanProgress?: { current: number; total: number };

    constructor(private plugin: Plugin) {
        this.statusBarItem = this.plugin.addStatusBarItem();
    }

    update(processedCount: number, unprocessedCount: number, scanProgress?: { current: number; total: number }): void {
        // Check if values have changed
        const hasChanged = 
            this.lastProcessedCount !== processedCount ||
            this.lastUnprocessedCount !== unprocessedCount ||
            this.hasScanProgressChanged(scanProgress);

        if (!hasChanged) {
            return;
        }

        // Calculate differences for display
        const processedDiff = this.lastProcessedCount >= 0 ? processedCount - this.lastProcessedCount : 0;
        const unprocessedDiff = this.lastUnprocessedCount >= 0 ? unprocessedCount - this.lastUnprocessedCount : 0;

        // Update cached values
        this.lastProcessedCount = processedCount;
        this.lastUnprocessedCount = unprocessedCount;
        this.lastScanProgress = scanProgress ? {...scanProgress} : undefined;

        if (scanProgress && scanProgress.total > 0) {
            // Update scanning progress without animation
            const percentage = Math.round((scanProgress.current / scanProgress.total) * 100);
            const text = `⏳ Scanning: ${percentage}% | ${scanProgress.current}/${scanProgress.total} files`;
            this.statusBarItem.setText(text);
        } else {
            // Update final counts with fade animation
            this.statusBarItem.style.transition = 'opacity 0.5s ease-in-out';
            this.statusBarItem.style.opacity = '0';
            
            setTimeout(() => {
                const processedDiffText = processedDiff !== 0 ? ` (${processedDiff > 0 ? '+' : ''}${processedDiff})` : '';
                const unprocessedDiffText = unprocessedDiff !== 0 ? ` (${unprocessedDiff > 0 ? '+' : ''}${unprocessedDiff})` : '';
                
                const text = `📝 Processed: ${processedCount}${processedDiffText} | 🆕 Unprocessed: ${unprocessedCount}${unprocessedDiffText}`;
                this.statusBarItem.setText(text);
                this.statusBarItem.style.opacity = '1';
            }, 500);
        }
    }

    private hasScanProgressChanged(newProgress?: { current: number; total: number }): boolean {
        if (!newProgress && !this.lastScanProgress) return false;
        if (!newProgress || !this.lastScanProgress) return true;
        return newProgress.current !== this.lastScanProgress.current || 
               newProgress.total !== this.lastScanProgress.total;
    }
} 