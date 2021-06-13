import { makeContainer } from '@machinat/core/service';
import StateController from '@machinat/core/base/StateController';
import { ConnectEventValue } from '@machinat/webview';

import handleSocketConnect from './handleSocketConnect';
import handleAddNote from './handleAddNote';
import handleDeleteNote from './handleDeleteNote';
import handleUpdateNote from './handleUpdateNote';
import useChatState from '../utils/useChatState';
import useUserState from '../utils/useUserState';
import type {
  WebviewActionContext,
  AddNoteAction,
  DeleteNoteAction,
  UpdateNoteAction,
} from '../types';

const handleWebviewAction =
  (
    stateController: StateController,
    getUserState: ReturnType<typeof useUserState>,
    getChatState: ReturnType<typeof useChatState>
  ) =>
  async (context: WebviewActionContext) => {
    const { event } = context;
    if (event.type === 'connect') {
      await handleSocketConnect(
        stateController,
        getUserState,
        getChatState
      )(context as WebviewActionContext<ConnectEventValue>);
    } else if (event.type === 'add_note') {
      await handleAddNote(stateController)(
        context as WebviewActionContext<AddNoteAction>
      );
    } else if (event.type === 'delete_note') {
      await handleDeleteNote(stateController)(
        context as WebviewActionContext<DeleteNoteAction>
      );
    } else if (event.type === 'update_note') {
      await handleUpdateNote(stateController)(
        context as WebviewActionContext<UpdateNoteAction>
      );
    }
  };

export default makeContainer({
  deps: [StateController, useUserState, useChatState] as const,
})(handleWebviewAction);
