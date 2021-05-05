import { Plugin } from 'obsidian';

export default class MyPlugin extends Plugin {
	async onload() {
		console.log('Loading Focus Mode plugin ...');

		this.addRibbonIcon('enter', 'Toggle Focus Mode', (event): void => {
			const app_container =
				// @ts-ignore
				this.app.dom.appContainerEl ||
				document.querySelector('.app-container');
			const view_content = app_container.querySelector('.view-content');
			const collapse_buttons = app_container.querySelectorAll(
				'.workspace-ribbon-collapse-btn'
			);

			Array.from(collapse_buttons).forEach((collapse_button) => {
				const is_not_collapsed =
					// @ts-ignore
					collapse_button.getAttribute('aria-label') !== 'Expand';

				if (is_not_collapsed) {
					// @ts-ignore
					collapse_button.click();
				}
			});

			if (app_container.style.visibility !== 'hidden') {
				app_container.style.visibility = 'hidden';
			} else {
				app_container.style.visibility = 'visible';
			}
			view_content.style.visibility = 'visible';
			// @ts-ignore
			event.target.style.visibility = 'visible';
		});
	}

	onunload() {
		console.log('Unloading Focus Mode plugin ...');
	}
}