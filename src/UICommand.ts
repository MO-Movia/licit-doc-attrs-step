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

  shouldRespondToUIEvent = (e: any): boolean => {
    return e.type === UICommand.EventType.CLICK;
  };

  renderLabel = (state: EditorState): string | null | HTMLElement => {
    return null;
  };

  isActive = (_state: EditorState): boolean => {
    return false;
  };

  isEnabled = (
    state: EditorState,
    view?: EditorView,
    _menuTitle?: string
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

    return this.execute(dryRunState, undefined, view, null);
  };

  dryRunEditorStateProxyGetter = (state: any, propKey: string): any => {
    const val = state[propKey];
    if (propKey === 'tr' && val instanceof Transaction) {
      return val.setMeta('dryrun', true);
    }
    return val;
  };

  dryRunEditorStateProxySetter = (
    state: any,
    propKey: string,
    propValue: any
  ): boolean => {
    state[propKey] = propValue;
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
