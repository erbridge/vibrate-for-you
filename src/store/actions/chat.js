import { createAction } from 'redux-actions';

export const SEND_MESSAGE = '@@vfy/SEND_MESSAGE';

export const SET_CHOICES = '@@vfy/SET_CHOICES';
export const CLEAR_CHOICES = '@@vfy/CLEAR_CHOICES';

export const UPDATE_STORY_STATE = '@@vfy/UPDATE_STORY_STATE';

export const sendMessage = createAction(SEND_MESSAGE);

export const setChoices = createAction(SET_CHOICES);
export const clearChoices = createAction(CLEAR_CHOICES);

export const updateStoryState = createAction(UPDATE_STORY_STATE);
