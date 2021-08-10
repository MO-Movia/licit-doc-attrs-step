/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */

import UICommand from './UICommand';
import {Transaction} from 'prosemirror-state';
import {createEditor, doc, p} from 'jest-prosemirror';
import { describe,it , expect, jest, beforeAll, afterAll,beforeEach, xit} from '@jest/globals';

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

  describe('isEnabled', () => {
    let uiCmd: UICommand;

    beforeEach(() => (uiCmd = new UICommand()));

    describe('when command is enabled', () => {
      xit('should return truthy value', () => {
        // TODO: replace this comment with steps to enable the command.
        // So skipping this for now

        const output = uiCmd.isEnabled(editor.state, editor.view);

        expect(output).toBeTruthy();
      });
    });

    describe('when command is not enabled', () => {
      xit('should return falsy value', () => {
        // TODO: replace this comment with steps to disable the command.
        // So skipping this for now

        const output = uiCmd.isEnabled(editor.state, editor.view);

        expect(output).toBeFalsy();
      });
    });
  });

  it('should respond to UI event', () => {
    const uiCmd = new UICommand();
    const respond = uiCmd.shouldRespondToUIEvent({
      type: UICommand.EventType.CLICK,
    });
    expect(respond).toEqual(true);
  });

  it('should execute custom', () => {
    const uiCmd = new UICommand();
    const tr = uiCmd.executeCustom(editor.state, editor.state.tr, 0, 0);
    expect(tr.doc).toBe(editor.state.tr.doc);
  });

  it('should not be active by default', () => {
    const uiCmd = new UICommand();
    const active = uiCmd.isActive(editor.state);
    expect(active).toEqual(false);
  });

  it('should label be null by default', () => {
    const uiCmd = new UICommand();
    const label = uiCmd.renderLabel(editor.state);
    expect(label).toEqual(null);
  });

  it('should be disabled if error thrown', () => {
    const uiCmd = new UICommand();
    const mockWFUI = jest.fn();
    mockWFUI.mockReturnValue(Promise.reject('this is error'));
    uiCmd.waitForUserInput = mockWFUI;
    const enabled = uiCmd.isEnabled(editor.state, editor.view);
    expect(enabled).toEqual(false);
  });

  xit('should set transaction meta data dryrun to true', () => {
    const uiCmd = new UICommand();
    const obj = uiCmd.dryRunEditorStateProxyGetter(editor.state, 'tr');
    expect(obj).toBeInstanceOf(Transaction);

    // TODO: Generally tests should not branch.
    // During execution line 86 will abort the test if it does not pass.
    // Therefore you will never get to line 92 if it's not a Transaction

    if (obj instanceof Transaction) {
      const meta = obj.getMeta('dryrun');
      expect(meta).toEqual(true);
    }
  });

  describe('dryRunEditorStateProxyGetter', () => {
    let tr: Transaction;
    let state;
    let uiCmd: UICommand;

    beforeEach(() => {
      tr = new Transaction({});
      tr.setMeta = jest.fn().mockImplementation(() => tr);
      // use same spy for both cases
      state = {tr, other: tr};
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

  describe('dryRunEditorStateProxySetter', () => {
    it('should set state property', () => {
      const uiCmd = new UICommand();
      const testVal = 'xVal';
      uiCmd.dryRunEditorStateProxySetter(editor.state, 'xTest', testVal);
      expect(editor.state.xTest).toEqual(testVal);
    });
  });
});
