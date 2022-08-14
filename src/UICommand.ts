/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types*/

import {EditorState, Selection, Transaction} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {EditorView} from 'prosemirror-view';

export type IsActiveCall = (state: EditorState) => boolean;

export type FindNodeTypeInSelectionCall = (selection: Selection) => Record<string, unknown>;

const EventType = {
  CLICK: 'mouseup',
  MOUSEENTER: 'mouseenter',
};

class UICommand {
  static EventType = EventType;

  shouldRespondToUIEvent = (e: any): boolean => {
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
    event?: any
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
    event?: any
  ): Promise<any> => {
    return Promise.resolve(undefined);
  };

  executeWithUserInput = (
    state: EditorState,
    dispatch?: (tr: Transform) => void,
    view?: EditorView,
    inputs?: any
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