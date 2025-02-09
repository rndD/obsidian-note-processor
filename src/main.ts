import { App, Plugin, TFile, Notice, TAbstractFile } from 'obsidian';
import { FULL_RESCAN_INTERVAL } from './constants';
import { FileProcessor } from './services/FileProcessor';
import { CacheManager } from './services/CacheManager';
import { StatusBar } from './ui/StatusBar';

export default class RandomNoteProcessor extends Plugin {
    private fileProcessor: FileProcessor;
    private cacheManager: CacheManager;
    private statusBar: StatusBar;
    private rescanInterval: number;

    async onload() {
        // Initialize services
        this.fileProcessor = new FileProcessor(this.app);
        this.cacheManager = new CacheManager(this.app);
        this.statusBar = new StatusBar(this);

        // Initial scan
        await this.cacheManager.performFullScan();
        this.updateStatusBar();

        // Register file events
        this.registerEvent(
            this.app.vault.on('modify', async (file: TAbstractFile) => {
                if (file instanceof TFile && file.extension === 'md') {
                    await this.cacheManager.updateFileInCache(file);
                    this.updateStatusBar();
                }
            })
        );

        this.registerEvent(
            this.app.vault.on('create', async (file: TAbstractFile) => {
                if (file instanceof TFile && file.extension === 'md') {
                    await this.cacheManager.updateFileInCache(file);
                    this.updateStatusBar();
                }
            })
        );

        this.registerEvent(
            this.app.vault.on('delete', (file: TAbstractFile) => {
                if (file instanceof TFile && file.extension === 'md') {
                    this.cacheManager.removeFileFromCache(file);
                    this.updateStatusBar();
                }
            })
        );

        // Set up periodic full rescan
        this.rescanInterval = window.setInterval(
            async () => {
                await this.cacheManager.performFullScan();
                this.updateStatusBar();
            },
            FULL_RESCAN_INTERVAL
        );

        // Register commands
        this.addCommand({
            id: 'open-random-unprocessed-note',
            name: 'Open Random Unprocessed Note',
            callback: () => this.openRandomUnprocessedNote(),
        });

        this.addCommand({
            id: 'mark-note-processed',
            name: 'Mark Note as Processed',
            callback: async () => {
                await this.markNoteAsProcessed();
            }
        });

        this.addCommand({
            id: 'unprocess-note',
            name: 'Unprocess Note',
            callback: async () => {
                await this.unprocessNote();
            }
        });
    }

    private updateStatusBar(): void {
        this.statusBar.update(
            this.cacheManager.getProcessedCount(),
            this.cacheManager.getUnprocessedCount(),
            !this.cacheManager.isReady() ? this.cacheManager.getScanProgress() : undefined
        );
    }

    async openRandomUnprocessedNote(): Promise<void> {
        if (!this.cacheManager.isReady()) {
            new Notice('Please wait, still scanning notes...');
            return;
        }

        const unprocessedPaths = this.cacheManager.getUnprocessedPaths();

        if (unprocessedPaths.length === 0) {
            new Notice('No unprocessed notes found!');
            return;
        }

        const randomPath = unprocessedPaths[Math.floor(Math.random() * unprocessedPaths.length)];
        this.app.workspace.openLinkText(randomPath, '', true);
    }

    async markNoteAsProcessed(): Promise<void> {
        const activeFile = this.app.workspace.getActiveFile();
        
        if (!activeFile) {
            new Notice('No active file!');
            return;
        }

        await this.fileProcessor.markProcessed(activeFile);
        await this.cacheManager.updateFileInCache(activeFile);
        this.updateStatusBar();
        new Notice('Note marked as processed!');
    }

    async unprocessNote(): Promise<void> {
        const activeFile = this.app.workspace.getActiveFile();
        
        if (!activeFile) {
            new Notice('No active file!');
            return;
        }

        await this.fileProcessor.markUnprocessed(activeFile);
        await this.cacheManager.updateFileInCache(activeFile);
        this.updateStatusBar();
        new Notice('Note marked as unprocessed!');
    }

    onunload(): void {
        if (this.rescanInterval) {
            window.clearInterval(this.rescanInterval);
        }
    }
} 