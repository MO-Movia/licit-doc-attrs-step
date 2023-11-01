import {PluginKey, EditorState} from 'prosemirror-state';
import {keymap} from 'prosemirror-keymap';
import {Transform} from 'prosemirror-transform';
import {EditorView} from 'prosemirror-view';

export type UserKeyCommand = (
  state: EditorState,
  dispatch?: (tr: Transform) => void,
  view?: EditorView
) => boolean;

export type UserKeyMap = {
  [key: string]: UserKeyCommand;
};

export function makeKeyMap(
  description: string,
  windows: string,
  mac: string,
  common?: string
): any {
  return {
    description: description,
    windows: windows,
    mac: mac,
    common: common,
  };
}

export function makeKeyMapWithCommon(description: string, common: string): any {
  const windows = common.replace(/Mod/i, 'Ctrl');
  const mac = common.replace(/Mod/i, 'Cmd');
  return makeKeyMap(description, windows, mac, common);
}

// [FS] IRAD-1005 2020-07-07
// Upgrade outdated packages.
// set plugin keys so that to avoid duplicate key error when keys are assigned automatically.
export function setPluginKey(plugin: any, key: string) {
  if (plugin?.spec) {
    plugin.spec.key = new PluginKey(key + 'Plugin');
    if (plugin.spec.key) {
      plugin.key = plugin.spec.key.key;
    }
  }
  return plugin;
}

export function createKeyMapPlugin(pluginKeyMap: any, name: string) {
  return setPluginKey(keymap(pluginKeyMap), name);
}
