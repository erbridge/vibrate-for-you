import { handleActions } from 'redux-actions';

import {
  ADD_CHOICE,
  CLEAR_ALL_CONVERSATIONS,
  CLEAR_CHOICES,
  SEND_MESSAGE,
  SET_CHOICES,
  SET_READ,
  SET_RECEIVED,
  SET_SENT,
  SET_TYPING,
  START_CONVERSATION,
  UPDATE_STORY_STATE,
} from '../actions/chat';

export default handleActions(
  {
    [START_CONVERSATION]: {
      next(state, { payload: { name } }) {
        const conversations = JSON.parse(JSON.stringify(state.conversations));

        conversations.push({
          name,
          messages: [],
          choices: [],
          lastSentIndex: -1,
          lastReceivedIndex: -1,
          lastReadIndex: -1,
          typingState: 'inactive',
          storyState: '',
        });

        return { ...state, conversations };
      },
      throw(state, { payload }) {
        console.error(payload);

        // FIXME: Do something more with the error.
        return state;
      },
    },
    [CLEAR_ALL_CONVERSATIONS]: {
      next(state) {
        return { ...state, conversations: [] };
      },
      throw(state, { payload }) {
        console.error(payload);

        // FIXME: Do something more with the error.
        return state;
      },
    },
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
    [SET_CHOICES]: {
      next(state, { payload: { index, choices } }) {
        const conversations = JSON.parse(JSON.stringify(state.conversations));

        conversations[index].choices = choices;

        return { ...state, conversations };
      },
      throw(state, { payload }) {
        console.error(payload);

        // FIXME: Do something more with the error.
        return state;
      },
    },
    [ADD_CHOICE]: {
      next(state, { payload: { index, choice } }) {
        const conversations = JSON.parse(JSON.stringify(state.conversations));

        conversations[index].choices.push(choice);

        return { ...state, conversations };
      },
      throw(state, { payload }) {
        console.error(payload);

        // FIXME: Do something more with the error.
        return state;
      },
    },
    [CLEAR_CHOICES]: {
      next(state, { payload: { index, choices } }) {
        const conversations = JSON.parse(JSON.stringify(state.conversations));

        conversations[index].choices = [];

        return { ...state, conversations };
      },
      throw(state, { payload }) {
        console.error(payload);

        // FIXME: Do something more with the error.
        return state;
      },
    },
    [SET_SENT]: {
      next(state, { payload: { index } }) {
        const conversations = JSON.parse(JSON.stringify(state.conversations));
        const conversation = conversations[index];

        conversation.lastSentIndex = conversation.messages.length - 1;

        return { ...state, conversations };
      },
      throw(state, { payload }) {
        console.error(payload);

        // FIXME: Do something more with the error.
        return state;
      },
    },
    [SET_RECEIVED]: {
      next(state, { payload: { index } }) {
        const conversations = JSON.parse(JSON.stringify(state.conversations));
        const conversation = conversations[index];

        const lastIndex = conversation.messages.length - 1;

        conversation.lastSentIndex = lastIndex;
        conversation.lastReceivedIndex = lastIndex;

        return { ...state, conversations };
      },
      throw(state, { payload }) {
        console.error(payload);

        // FIXME: Do something more with the error.
        return state;
      },
    },
    [SET_READ]: {
      next(state, { payload: { index } }) {
        const conversations = JSON.parse(JSON.stringify(state.conversations));
        const conversation = conversations[index];

        const lastIndex = conversation.messages.length - 1;

        conversation.lastSentIndex = lastIndex;
        conversation.lastReceivedIndex = lastIndex;
        conversation.lastReadIndex = lastIndex;

        return { ...state, conversations };
      },
      throw(state, { payload }) {
        console.error(payload);

        // FIXME: Do something more with the error.
        return state;
      },
    },
    [SET_TYPING]: {
      next(state, { payload: { index, typingState } }) {
        const conversations = JSON.parse(JSON.stringify(state.conversations));

        conversations[index].typingState = typingState;

        return { ...state, conversations };
      },
      throw(state, { payload }) {
        console.error(payload);

        // FIXME: Do something more with the error.
        return state;
      },
    },
    [UPDATE_STORY_STATE]: {
      next(state, { payload: { index, storyState } }) {
        const conversations = JSON.parse(JSON.stringify(state.conversations));

        conversations[index].storyState = storyState;

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
    conversations: [],
  },
);
