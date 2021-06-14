import UICommand from './UICommand';
import {Transaction} from 'prosemirror-state';
import {createEditor, doc, p} from 'jest-prosemirror';

describe('UICommand', () => {
  const editor = createEditor(doc(p('<cursor>')));

  beforeAll(() => {
    // Create a spy on console (console.error in this case) and provide some mocked implementation
    // In mocking global objects it's usually better than simple `jest.fn()`
    // because you can `unmock` it in clean way doing `mockRestore`
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    // Restore mock after all tests are done, so it won't affect other test suites
    console.error.mockRestore();
  });

  it('isEnabled', () => {
    const uiCmd = new UICommand();
    const enabled = uiCmd.isEnabled(editor.state, editor.view);
    expect(enabled).toEqual(false);
  });

  it('shouldRespondToUIEvent', () => {
    const uiCmd = new UICommand();
    const respond = uiCmd.shouldRespondToUIEvent({
      type: UICommand.EventType.CLICK,
    });
    expect(respond).toEqual(true);
  });

  it('executeCustom', () => {
    const uiCmd = new UICommand();
    const tr = uiCmd.executeCustom(editor.state, editor.state.tr, 0, 0);
    expect(tr.doc).toBe(editor.state.tr.doc);
  });

  it('isActive', () => {
    const uiCmd = new UICommand();
    const active = uiCmd.isActive(editor.state);
    expect(active).toEqual(false);
  });

  it('renderLabel', () => {
    const uiCmd = new UICommand();
    const label = uiCmd.renderLabel(editor.state);
    expect(label).toEqual(null);
  });

  it('isEnabled rejected', () => {
    const uiCmd = new UICommand();
    const mockWFUI = jest.fn();
    mockWFUI.mockReturnValue(Promise.reject('this is error'));
    uiCmd.waitForUserInput = mockWFUI;
    const enabled = uiCmd.isEnabled(editor.state, editor.view);
    expect(enabled).toEqual(false);
  });

  it('dryRunGet Transaction', () => {
    const uiCmd = new UICommand();
    const obj = uiCmd.dryRunEditorStateProxyGetter(editor.state, 'tr');
    expect(obj).toBeInstanceOf(Transaction);
  });

  it('dryRunGet Any', () => {
    const uiCmd = new UICommand();
    const key = 'xTest';
    const val = 'xVal';
    editor.state[key] = val;
    const obj = uiCmd.dryRunEditorStateProxyGetter(editor.state, key);
    expect(obj).toEqual(val);
  });

  it('dryRunSet', () => {
    const uiCmd = new UICommand();
    const testVal = 'xVal';
    uiCmd.dryRunEditorStateProxySetter(editor.state, 'xTest', testVal);
    expect(editor.state.xTest).toEqual(testVal);
  });
});
