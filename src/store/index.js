import { createStore as createReduxStore } from 'redux';

import reducers from './reducers';

export const createStore = () => createReduxStore(reducers);
