import {
  makeKeyMap,
  makeKeyMapWithCommon,
  createKeyMapPlugin,
  setPluginKey,
} from './KeyCommand';
import * as PM from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {EditorView} from 'prosemirror-view';
import {createEditor, doc, p} from 'jest-prosemirror';

describe('KeyCommand', () => {
  const HELLO = 'hello';
  // Mockup execute method to insert text to compare later.
  const executeMock = jest.fn(
    (
      state: PM.EditorState,
      dispatch: ?(tr: Transform) => void,
      view: ?EditorView,
      event: ?SyntheticEvent<>
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

  test('PluginKeyBindings', () => {
    createEditor(doc(p('<cursor>')), {plugins: [plugin]})
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

  test('SetPluginKey With Spec', () => {
    plugin = setPluginKey(plugin, NAME);
    expect(plugin.key).toEqual(KEY);
  });

  test('SetPluginKey Without Spec', () => {
    plugin.spec = undefined;
    plugin.key = undefined;
    plugin = setPluginKey(plugin, NAME);
    expect(plugin.key).not.toEqual(KEY);
  });

  test('KeyMapping', () => {
    const TRIAL = 'Trial';
    const keymap0 = makeKeyMap(TRIAL, 'Alt-0', 'Alt-0', 'Alt-0');
    const keymap1 = makeKeyMapWithCommon(TRIAL, 'Alt-0');

    expect(keymap0).toEqual(keymap1);
  });
});
