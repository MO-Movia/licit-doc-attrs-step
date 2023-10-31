import {
  makeKeyMap,
  makeKeyMapWithCommon,
  createKeyMapPlugin,
  setPluginKey,
} from './KeyCommand';
import * as PM from 'prosemirror-state';
import { Transform } from 'prosemirror-transform';
import { createEditor, doc, p } from 'jest-prosemirror';
import { describe, it, expect, jest } from '@jest/globals';

describe('KeyCommand', () => {
  const HELLO = 'hello';
  // Mockup execute method to insert text to compare later.
  const executeMock = jest.fn(
    (
      state: PM.EditorState,
      dispatch?: (tr: Transform) => void
    ): boolean => {
      if (dispatch) {
        dispatch(state.tr.insertText(HELLO));
      }
      return false;
    }
  );

  // Create our own KeyMap Plugin
  let plugin = createKeyMapPlugin({
    ['Mod-A']: executeMock,
  });

  it('should plugin key map work', () => {
    createEditor(doc(p('<cursor>')), { plugins: [plugin] })
      .shortcut('Mod-A')
      .callback((content) => {
        // success case
        expect(content.state.doc).toEqualProsemirrorNode(doc(p(HELLO)));
        // failed case
        expect(content.state.doc).not.toEqualProsemirrorNode(
          doc(p('something else'))
        );
      });
  });

  const NAME = 'Citation';
  const KEY = NAME + 'Plugin$';

  it('should set Plugin key when plugin having spec', () => {
    plugin = setPluginKey(plugin, NAME);
    expect(plugin.key).toEqual(KEY);
  });

  it('should set plugin key when plugin spec is not set', () => {
    plugin.spec = undefined;
    plugin.key = undefined;
    plugin = setPluginKey(plugin, NAME);
    expect(plugin.key).not.toEqual(KEY);
  });

  it('should handle os based key map', () => {
    const TRIAL = 'Trial';
    const keymap0 = makeKeyMap(TRIAL, 'Alt-0', 'Alt-0', 'Alt-0');
    const keymap1 = makeKeyMapWithCommon(TRIAL, 'Alt-0');
    expect(keymap0).toEqual(keymap1);
  });
});