import { createAction } from 'redux-actions';

export const START_CONVERSATION = '@@vfy/START_CONVERSATION';
export const CLEAR_ALL_CONVERSATIONS = '@@vfy/CLEAR_ALL_CONVERSATIONS';

export const SEND_MESSAGE = '@@vfy/SEND_MESSAGE';

export const SET_CHOICES = '@@vfy/SET_CHOICES';
export const ADD_CHOICE = '@@vfy/ADD_CHOICE';
export const CLEAR_CHOICES = '@@vfy/CLEAR_CHOICES';

export const SET_SENT = '@@vfy/SET_SENT';
export const SET_RECEIVED = '@@vfy/SET_RECEIVED';
export const SET_READ = '@@vfy/SET_READ';
export const SET_TYPING = '@@vfy/SET_TYPING';

export const UPDATE_STORY_STATE = '@@vfy/UPDATE_STORY_STATE';

export const startConversation = createAction(START_CONVERSATION);
export const clearAllConversations = createAction(CLEAR_ALL_CONVERSATIONS);

export const sendMessage = createAction(SEND_MESSAGE);

export const setChoices = createAction(SET_CHOICES);
export const addChoice = createAction(ADD_CHOICE);
export const clearChoices = createAction(CLEAR_CHOICES);

export const setSent = createAction(SET_SENT);
export const setReceived = createAction(SET_RECEIVED);
export const setRead = createAction(SET_READ);
export const setTyping = createAction(SET_TYPING);

export const updateStoryState = createAction(UPDATE_STORY_STATE);
