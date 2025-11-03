import {Plugin, PluginKey} from 'prosemirror-state';
import {keymap} from 'prosemirror-keymap';
import {
  makeKeyMap,
  makeKeyMapWithCommon,
  setPluginKey,
  createKeyMapPlugin,
} from './KeyCommand';

jest.mock('prosemirror-keymap', () => ({
  keymap: jest.fn((map) => ({spec: {map}, keymapCreated: true})),
}));

describe('keymap-utils', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('makeKeyMap', () => {
    it('should return an object with description, windows, mac, and common', () => {
      const result = makeKeyMap('Bold', 'Ctrl-B', 'Cmd-B', 'Mod-B');
      expect(result).toEqual({
        description: 'Bold',
        windows: 'Ctrl-B',
        mac: 'Cmd-B',
        common: 'Mod-B',
      });
    });

    it('should allow common to be undefined', () => {
      const result = makeKeyMap('Italic', 'Ctrl-I', 'Cmd-I');
      expect(result).toEqual({
        description: 'Italic',
        windows: 'Ctrl-I',
        mac: 'Cmd-I',
        common: undefined,
      });
    });
  });

  describe('makeKeyMapWithCommon', () => {
    it('should replace Mod with Ctrl on Windows and Cmd on Mac', () => {
      const result = makeKeyMapWithCommon('Save', 'Mod-S');
      expect(result).toEqual({
        description: 'Save',
        windows: 'Ctrl-S',
        mac: 'Cmd-S',
        common: 'Mod-S',
      });
    });

    it('should handle lowercase "mod"', () => {
      const result = makeKeyMapWithCommon('Undo', 'mod-Z');
      expect(result).toEqual({
        description: 'Undo',
        windows: 'Ctrl-Z',
        mac: 'Cmd-Z',
        common: 'mod-Z',
      });
    });
  });

  describe('setPluginKey', () => {
    it('should set PluginKey on plugin.spec and return the plugin', () => {
      const plugin = {spec: {}} as unknown as Plugin;
      const result = setPluginKey(plugin, 'testKey');

      expect(result).toBe(plugin);
      expect(plugin.spec.key).toBeInstanceOf(PluginKey);
    });

    it('should return plugin unchanged if spec is missing', () => {
      const plugin = {} as unknown as Plugin;
      const result = setPluginKey(plugin, 'noSpec');
      expect(result).toBe(plugin);
      expect((plugin as any).spec).toBeUndefined();
    });
  });

  describe('createKeyMapPlugin', () => {
    it('should create keymap plugin and set PluginKey', () => {
      const fakeMap = {'Mod-b': jest.fn()};
      const result = createKeyMapPlugin(fakeMap, 'bold');

      // ensure keymap() was called
      expect(keymap).toHaveBeenCalledWith(fakeMap);

      // ensure returned plugin has key set
      expect(result).toHaveProperty('spec.key');
    });
  });
});
