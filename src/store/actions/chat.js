import { createAction } from 'redux-actions';

export const SEND_MESSAGE = '@@vfy/SEND_MESSAGE';

export const sendMessage = createAction(SEND_MESSAGE);
