// @flow

import {EditorState, Selection, Transaction} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {EditorView} from 'prosemirror-view';

export type IsActiveCall = (state: EditorState) => boolean;

export type FindNodeTypeInSelectionCall = (selection: Selection) => Object;

const EventType = {
  CLICK: 'mouseup',
  MOUSEENTER: 'mouseenter',
};

class UICommand {
  static EventType = EventType;

  shouldRespondToUIEvent = (e: SyntheticEvent<> | MouseEvent): boolean => {
    return e.type === UICommand.EventType.CLICK;
  };

  renderLabel = (state: EditorState): any => {
    return null;
  };

  isActive = (state: EditorState): boolean => {
    return false;
  };

  isEnabled = (
    state: EditorState,
    view: ?EditorView,
    menuTitle: string
  ): boolean => {
    return this.dryRun(state, view);
  };

  dryRun = (state: EditorState, view: ?EditorView): boolean => {
    const fnProxy = window['Proxy'];

    const dryRunState = fnProxy
      ? new fnProxy(state, {
          get: this.dryRunEditorStateProxyGetter,
          set: this.dryRunEditorStateProxySetter,
        })
      : state;

    return this.execute(dryRunState, null, view);
  };

  dryRunEditorStateProxyGetter = (state: EditorState, propKey: string): any => {
    const val = state[propKey];
    if (propKey === 'tr' && val instanceof Transaction) {
      return val.setMeta('dryrun', true);
    }
    return val;
  };

  dryRunEditorStateProxySetter = (
    state: EditorState,
    propKey: string,
    propValue: any
  ): boolean => {
    state[propKey] = propValue;
    // Indicate success
    return true;
  };

  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
    event: ?SyntheticEvent<>
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
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
    event: ?SyntheticEvent<>
  ): Promise<any> => {
    return Promise.resolve(undefined);
  };

  executeWithUserInput = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
    inputs: any
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

export default UICommand;
