/**
 * @license MIT
 * @copyright Copyright 2025 Modus Operandi Inc. All Rights Reserved.
 */

import { EditorState, Selection, Transaction } from 'prosemirror-state';
import { Transform } from 'prosemirror-transform';
import { EditorView } from 'prosemirror-view';

export type IsActiveCall = (state: EditorState) => boolean;

export type FindNodeTypeInSelectionCall = (
  selection: Selection
) => Record<string, unknown>;

export const EventType = {
  CLICK: 'mouseup',
  MOUSEENTER: 'mouseenter',
};

export abstract class UICommand {
  static readonly EventType = EventType;

  shouldRespondToUIEvent = (e: any): boolean => {
    return e.type === UICommand.EventType.CLICK;
  };

  renderLabel(_state: EditorState): any {
    return null;
  }

  isActive(_state: EditorState): boolean {
    return true;
  }

  isEnabled = (state: EditorState, view?: EditorView): boolean => {
    return this.dryRun(state, view);
  };

  dryRun = (state: EditorState, view?: EditorView): boolean => {
    const fnProxy = globalThis.window?.Proxy;

    const dryRunState = fnProxy
      ? new fnProxy(state, {
        get: this.dryRunEditorStateProxyGetter,
        set: this.dryRunEditorStateProxySetter,
      })
      : state;

    try {
      return this.execute(dryRunState, undefined, view, null);
    } catch (error) {
      // A dry-run is a speculative "can this command run?" check invoked
      // during CommandButton.render().  If the document is in an invalid
      // state (e.g. an inline node where a block is expected), the
      // speculative transaction will throw a TransformError.  Disabling
      // the button is the correct response — crashing the React tree is not.
      console.error(error);
      return false;
    }
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

  abstract waitForUserInput(
    state: EditorState,
    dispatch?: (tr: Transform) => void,
    view?: EditorView,
    event?: any
  ): Promise<any>;

  abstract executeWithUserInput(
    state: EditorState,
    dispatch?: (tr: Transform) => void,
    view?: EditorView,
    inputs?: any
  ): boolean;

  abstract cancel(): void;

  abstract executeCustom(
    state: EditorState,
    tr: Transform,
    from: number,
    to: number
  ): Transform;
  
  abstract executeCustomStyleForTable(
    state: EditorState,
    tr: Transform,
    from: number,
    to: number
  ): Transform;
}
