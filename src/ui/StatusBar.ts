import { Plugin } from 'obsidian';

export class StatusBar {
    private statusBarItem: HTMLElement;

    constructor(private plugin: Plugin) {
        this.statusBarItem = this.plugin.addStatusBarItem();
    }

    update(processedCount: number, unprocessedCount: number, scanProgress?: { current: number; total: number }): void {
        // Update the status bar with a smooth fade effect
        this.statusBarItem.style.transition = 'opacity 0.5s ease-in-out';
        this.statusBarItem.style.opacity = '0';
        
        setTimeout(() => {
            let text = '';
            if (scanProgress && scanProgress.total > 0) {
                const percentage = Math.round((scanProgress.current / scanProgress.total) * 100);
                text = `⏳ Scanning: ${percentage}% | ${scanProgress.current}/${scanProgress.total} files`;
            } else {
                text = `📝 Processed: ${processedCount} | 🆕 Unprocessed: ${unprocessedCount}`;
            }
            
            this.statusBarItem.setText(text);
            this.statusBarItem.style.opacity = '1';
        }, 500);
    }
} 