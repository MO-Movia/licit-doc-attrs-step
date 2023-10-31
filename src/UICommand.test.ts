import UICommand from './UICommand';
import { EditorState, Transaction } from 'prosemirror-state';
import { createEditor, doc, p } from 'jest-prosemirror';
import { describe, it, expect, jest, beforeAll, afterAll, beforeEach } from '@jest/globals';

describe('UICommand', () => {
  const editor = createEditor(doc(p('<cursor>')));
  const uiCmd = new UICommand();
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { return; });
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  it('should respond to UI event', () => {
    const respond = uiCmd.shouldRespondToUIEvent({
      type: UICommand.EventType.CLICK,
    });
    expect(respond).toEqual(true);
  });

  it('should execute custom', () => {
    const tr = uiCmd.executeCustom(editor.state, editor.state.tr, 0, 0);
    expect(tr.doc).toBe(editor.state.tr.doc);
  });

  it('should not be active by default', () => {
    const active = uiCmd.isActive(editor.state);
    expect(active).toEqual(false);
  });

  it('should label be null by default', () => {
    const label = uiCmd.renderLabel(editor.state);
    expect(label).toEqual(null);
  });

  it('should be disabled if error thrown', () => {
    const mockWFUI = jest.fn();
    mockWFUI.mockReturnValue(Promise.reject('this is error'));
    uiCmd.waitForUserInput = mockWFUI;
    const enabled = uiCmd.isEnabled(editor.state, editor.view);
    expect(enabled).toEqual(false);
  });

  describe('dryRunEditorStateProxyGetter', () => {
    let tr: Transaction;
    let state;
    let uiCmd: UICommand;

    beforeEach(() => {
      tr = new Transaction({});
      tr.setMeta = jest.fn().mockImplementation(() => tr);
      state = { tr, other: tr };
      uiCmd = new UICommand();
    });

    describe('when getting the transaction', () => {
      it('should update transaction metadata', () => {
        const output = uiCmd.dryRunEditorStateProxyGetter(state, 'tr');
        expect(tr.setMeta).toHaveBeenCalled();
        expect(output).toBe(state.tr);
      });
    });

    describe('when getting other data', () => {
      it('should not update transaction metadata', () => {
        const output = uiCmd.dryRunEditorStateProxyGetter(state, 'other');
        expect(tr.setMeta).not.toHaveBeenCalled();
        expect(output).toBe(state.other);
      });
    });
  });

  describe('cancel ', () => {
    it('should be retutn undefined', () => {
      expect(uiCmd.cancel()).toBeUndefined();
    });
  });
  describe('dryRunEditorStateProxySetter', () => {
    it('should set state property', () => {
      const testVal = 'xVal';
      uiCmd.dryRunEditorStateProxySetter(editor.state, 'xTest', testVal);
      expect(editor.state.xTest).toEqual(testVal);
    });
  });

  describe('executeWithUserInput', () => {
    it('should be return false', () => {
      const state_ = {} as unknown as EditorState;
      expect(uiCmd.executeWithUserInput(state_)).toBeFalsy();

    });
  });
});
















