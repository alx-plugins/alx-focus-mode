import { Plugin } from "obsidian";
import { ALxFocusModeSettingTab } from "settings";
import "./style/main.css";
import "./style/left-ribbon.css";
import "./style/header.css";
interface ALxFocusModeSettings {
  hideLeftRibbonEntirely: boolean;
}

const DEFAULT_SETTINGS: ALxFocusModeSettings = {
  hideLeftRibbonEntirely: true,
};

export default class ALxFocusMode extends Plugin {
  settings: ALxFocusModeSettings;

  focusModeActive = false;

  maximisedClass = "maximised";
  focusModeClass = "focus-mode";
  hideLeftRibbonEntirelyClass = "hide-ribbon";

  leftSplitCollapsed: boolean;
  rightSplitCollapsed: boolean;

  storeSplitsValues() {
    // @ts-ignore
    this.leftSplitCollapsed = this.app.workspace.leftSplit.collapsed;
    // @ts-ignore
    this.rightSplitCollapsed = this.app.workspace.rightSplit.collapsed;
  }

  collapseSplits() {
    // @ts-ignore
    this.app.workspace.leftSplit.collapse();
    // @ts-ignore
    this.app.workspace.rightSplit.collapse();
  }

  restoreSplits() {
    if (!this.leftSplitCollapsed) {
      // @ts-ignore
      this.app.workspace.leftSplit.expand();
    }

    if (!this.rightSplitCollapsed) {
      // @ts-ignore
      this.app.workspace.rightSplit.expand();
    }
  }

  enableSuperFocusMode() {
    // @ts-ignore
    this.app.workspace.rootSplit.containerEl.toggleClass(
      this.maximisedClass,
      // @ts-ignore
      !this.app.workspace.rootSplit.containerEl.hasClass(this.maximisedClass),
    );

    // @ts-ignore
    this.app.workspace.onLayoutChange();

    if (!document.body.classList.contains(this.focusModeClass)) {
      document.body.classList.add(this.focusModeClass);
    }

    this.collapseSplits();

    this.focusModeActive = true;
  }
  enableFocusMode() {
    if (
      // @ts-ignore
      this.app.workspace.rootSplit.containerEl.hasClass(this.maximisedClass)
    ) {
      // @ts-ignore
      this.app.workspace.rootSplit.containerEl.removeClass(this.maximisedClass);
      // @ts-ignore
      this.app.workspace.onLayoutChange();
    }

    document.body.classList.toggle(
      this.focusModeClass,
      !document.body.classList.contains(this.focusModeClass),
    );

    this.storeSplitsValues();
    this.collapseSplits();

    this.focusModeActive = true;
  }
  disableFocusMode() {
    if (
      // @ts-ignore
      this.app.workspace.rootSplit.containerEl.hasClass(this.maximisedClass)
    ) {
      // @ts-ignore
      this.app.workspace.rootSplit.containerEl.removeClass(this.maximisedClass);
      // @ts-ignore
      this.app.workspace.onLayoutChange();
    }

    if (document.body.classList.contains(this.focusModeClass)) {
      document.body.classList.remove(this.focusModeClass);
    }

    this.restoreSplits();

    this.focusModeActive = false;
  }

  toggleFocusMode(superFocus: boolean = false) {
    if (superFocus) {
      this.enableSuperFocusMode();
    } else if (this.focusModeActive) {
      this.disableFocusMode();
    } else {
      this.enableFocusMode();
    }
  }

  prev: { key: string; time: number } = { key: "", time: 0 };

  async onload() {
    console.log("Loading Focus Mode plugin ...");

    await this.loadSettings();

    this.registerDomEvent(document, "dblclick", (ev) => {
      if (
        ev.target instanceof HTMLElement &&
        ev.target.matches(".view-header-icon") &&
        !this.focusModeActive
      )
        this.enableSuperFocusMode();
    });

    this.focusModeActive = document.body.classList.contains(
      this.focusModeClass,
    );

    this.registerDomEvent(document, "keydown", (ev) => {
      if (
        this.focusModeActive &&
        this.prev.key === "Escape" &&
        ev.key === "Escape" &&
        Date.now() - this.prev.time < 250
      ) {
        this.disableFocusMode();
      }
      this.prev = { key: ev.key, time: Date.now() };
    });

    if (
      this.settings.hideLeftRibbonEntirely &&
      !document.body.classList.contains(this.focusModeClass)
    ) {
      document.body.classList.add(this.hideLeftRibbonEntirelyClass);
    }

    this.addSettingTab(new ALxFocusModeSettingTab(this.app, this));

    this.addRibbonIcon("enter", "Toggle Focus Mode", (event) =>
      this.toggleFocusMode(false),
    ).on("contextmenu", "*", (e) => this.toggleFocusMode(true));

    this.addCommand({
      id: "toggle-focus-mode",
      name: "Toggle Focus Mode",
      callback: () => {
        this.toggleFocusMode();
      },
      hotkeys: [{ modifiers: ["Alt", "Mod"], key: "Z" }],
    });

    this.addCommand({
      id: "toggle-super-focus-mode",
      name: "Toggle Super Focus Mode (Active pane only)",
      callback: () => {
        this.toggleFocusMode(true);
      },
      hotkeys: [{ modifiers: ["Alt", "Mod", "Shift"], key: "Z" }],
    });
  }

  onunload() {
    console.log("Unloading Focus Mode plugin ...");
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
