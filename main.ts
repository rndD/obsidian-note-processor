import { App, Plugin, TFile, Notice } from 'obsidian';

export default class RandomNoteProcessor extends Plugin {
	async onload() {
		// Register command to open random unprocessed note
		this.addCommand({
			id: 'open-random-unprocessed-note',
			name: 'Open Random Unprocessed Note',
			callback: () => this.openRandomUnprocessedNote(),
		});

		// Register command to mark note as processed
		this.addCommand({
			id: 'mark-note-processed',
			name: 'Mark Note as Processed',
			callback: async () => {
				await this.markNoteAsProcessed();
			}
		});

		// Register command to unprocess note
		this.addCommand({
			id: 'unprocess-note',
			name: 'Unprocess Note',
			callback: async () => {
				await this.unprocessNote();
			}
		});
	}

	async openRandomUnprocessedNote() {
		const files = this.app.vault.getMarkdownFiles();
		const unprocessedFiles = files.filter(file => this.isUnprocessed(file));

		if (unprocessedFiles.length === 0) {
			new Notice('No unprocessed notes found!');
			return;
		}

		const randomFile = unprocessedFiles[Math.floor(Math.random() * unprocessedFiles.length)];
		this.app.workspace.openLinkText(randomFile.path, '', true);
	}

	async isUnprocessed(file: TFile): Promise<boolean> {
		const content = await this.app.vault.read(file);
		const hasNotProcessedTag = content.includes('#not_processed');
		const lacksProcessedTag = !content.includes('#processed');
		return hasNotProcessedTag || lacksProcessedTag;
	}

	async markNoteAsProcessed() {
		const activeFile = this.app.workspace.getActiveFile();
		
		if (!activeFile) {
			new Notice('No active file!');
			return;
		}

		let content = await this.app.vault.read(activeFile);
		
		if (content.includes('#not_processed')) {
			// Replace #not_processed with #processed
			content = content.replace('#not_processed', '#processed');
		} else {
			// Add #processed tag
			const lines = content.split('\n');
			if (lines[0].startsWith('#')) {
				lines[0] += ' #processed';
			} else {
				lines.unshift('#processed');
			}
			content = lines.join('\n');
		}
		
		// Save the modified content
		await this.app.vault.modify(activeFile, content);
		new Notice('Note marked as processed!');
	}

	async unprocessNote() {
		const activeFile = this.app.workspace.getActiveFile();
		
		if (!activeFile) {
			new Notice('No active file!');
			return;
		}

		let content = await this.app.vault.read(activeFile);
		
		// Replace #processed with #not_processed
		content = content.replace('#processed', '#not_processed');
		
		// Save the modified content
		await this.app.vault.modify(activeFile, content);
		new Notice('Note marked as unprocessed!');
	}
} 