import { handleActions } from 'redux-actions';

import { SEND_MESSAGE } from '../actions/chat';

export default handleActions(
  {
    [SEND_MESSAGE]: {
      next(state, { payload: { index, sender, text } }) {
        const conversations = JSON.parse(JSON.stringify(state.conversations));

        conversations[index].messages.push({ sender, text });

        return { ...state, conversations };
      },
      throw(state, { payload }) {
        console.error(payload);

        // FIXME: Do something more with the error.
        return state;
      },
    },
  },
  {
    conversations: [
      {
        name: 'Jaimie',
        messages: [
          {
            sender: 'Jaimie',
            text: 'Hi!',
          },
          {
            sender: 'Jaimie',
            text: 'How are you?',
          },
        ],
      },
    ],
  },
);
