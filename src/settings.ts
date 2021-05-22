import ALxFocusMode from "main";
import { PluginSettingTab, App, Setting } from "obsidian";

export class ALxFocusModeSettingTab extends PluginSettingTab {
  plugin: ALxFocusMode;

  constructor(app: App, plugin: ALxFocusMode) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("Hide Left Ribbon Entirely")
      .setDesc(
        "Show focus mode toggle at the top-left corner, removing the space left ribbon occupied",
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.hideLeftRibbonEntirely)
          .onChange(async (value) => {
            document.body.classList.toggle(
              this.plugin.hideLeftRibbonEntirelyClass,
              value,
            );
            this.plugin.settings.hideLeftRibbonEntirely = value;
            this.plugin.saveData(this.plugin.settings);
            this.display();
          }),
      );
  }
}
