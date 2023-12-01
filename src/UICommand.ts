import {EditorState, Selection, Transaction} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {EditorView} from 'prosemirror-view';

export type IsActiveCall = (state: EditorState) => boolean;

export type FindNodeTypeInSelectionCall = (
  selection: Selection
) => Record<string, unknown>;

export const EventType = {
  CLICK: 'mouseup',
  MOUSEENTER: 'mouseenter',
};

export class UICommand {
  static EventType = EventType;

  shouldRespondToUIEvent = (e: { type: string }): boolean => {
    return e.type === UICommand.EventType.CLICK;
  };

  renderLabel = (state: EditorState): string | null => {
    return null;
  };

  isActive = (state: EditorState): boolean => {
    return false;
  };

  isEnabled = (
    state: EditorState,
    view?: EditorView,
    menuTitle?: string
  ): boolean => {
    return this.dryRun(state, view);
  };

  dryRun = (state: EditorState, view?: EditorView): boolean => {
    const fnProxy = typeof window !== 'undefined' && window['Proxy'];

    const dryRunState = fnProxy
      ? new fnProxy(state, {
          get: this.dryRunEditorStateProxyGetter,
          set: this.dryRunEditorStateProxySetter,
        })
      : state;

    return this.execute(dryRunState, undefined, view, undefined);
  };

  dryRunEditorStateProxyGetter = <K extends keyof EditorState>(
    state: EditorState,
    propKey: K
  ): EditorState[K] | Transaction => {
    const val = state[propKey];
    if (propKey === 'tr' && val instanceof Transaction) {
      return val.setMeta('dryrun', true) as EditorState[K];
    }
    return val as EditorState[K] | Transaction;
  };


  dryRunEditorStateProxySetter = <K extends keyof EditorState>(
    state: EditorState,
    propKey: K,
    propValue: string
  ): boolean => {
    //const newState = { ...state, [propKey]: propValue } as EditorState;
    // Indicate success
    return true;
  };

  execute = (
    state: EditorState,
    dispatch?: (tr: Transform) => void,
    view?: EditorView,
    event?: Event
  ): boolean => {
    this.waitForUserInput(state, dispatch, view, event)
      .then((inputs) => {
        this.executeWithUserInput(state, dispatch, view, inputs);
      })
      .catch((error) => {
        console.error(error);
      });
    return false;
  };

  waitForUserInput = (
    state: EditorState,
    dispatch?: (tr: Transform) => void,
    view?: EditorView,
    event?: Event
  ): Promise<string | undefined> => {
    return Promise.resolve(undefined);
  };

  executeWithUserInput = (
    state: EditorState,
    dispatch?: (tr: Transform) => void,
    view?: EditorView,
    inputs?: string | undefined
  ): boolean => {
    return false;
  };

  cancel(): void {
    // subclass should overwrite this.
  }

  executeCustom = (
    state: EditorState,
    tr: Transform,
    from: number,
    to: number
  ): Transform => {
    return tr;
  };
}

// export class UICommand;
