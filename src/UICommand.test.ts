import {UICommand} from './UICommand';
import {EditorState, Transaction} from 'prosemirror-state';
import {createEditor, doc, p} from 'jest-prosemirror';
import {Node} from 'prosemirror-model';
import {Transform} from 'prosemirror-transform';
import {EditorView} from 'prosemirror-view';

class mockUICommand extends UICommand {
  waitForUserInput(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  executeWithUserInput(): boolean {
    throw new Error('Method not implemented.');
  }
  cancel(): void {
    throw new Error('Method not implemented.');
  }
  executeCustom(): Transform {
    throw new Error('Method not implemented.');
  }
}
describe('UICommand', () => {
  const editor = createEditor(doc(p('<cursor>')));
  const uiCmd: UICommand = new mockUICommand();
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
      return;
    });
  });

  afterAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
      return true;
    });
  });

  it('should respond to UI event', () => {
    const respond = uiCmd.shouldRespondToUIEvent({
      type: UICommand.EventType.CLICK,
    });
    expect(respond).toEqual(true);
  });

  it('should by default be active', () => {
    expect(uiCmd.isActive(null as unknown as EditorState)).toBeTruthy();
  });

  it('should by default not render label', () => {
    expect(uiCmd.renderLabel(null as unknown as EditorState)).toBeFalsy();
  });

  describe('dryRunEditorStateProxyGetter', () => {
    let tr: Transaction;
    let state: any;
    let uiCmd: UICommand;

    beforeEach(() => {
      tr = new Transaction({} as unknown as Node);
      jest.spyOn(tr, 'setMeta').mockImplementation(() => tr);
      state = {tr, other: tr};
      uiCmd = new mockUICommand();
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
      const testVal = 'xVal';
      expect(
        uiCmd.dryRunEditorStateProxySetter(editor.state, 'xTest', testVal)
      ).toBeTruthy();
    });
  });

  describe('execute', () => {
    it('should execute', () => {
      const spy = jest.spyOn(uiCmd, 'waitForUserInput').mockResolvedValue({});
      const state_ = {} as unknown as EditorState;
      uiCmd.execute(state_);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('isEnabled', () => {
    it('should call dryRun and execute with the correct arguments', () => {
      const spy = jest.spyOn(uiCmd, 'execute');
      uiCmd.isEnabled(
        {} as unknown as EditorState,
        {} as unknown as EditorView
      );
      expect(spy).toHaveBeenCalled();
    });
  });
});
