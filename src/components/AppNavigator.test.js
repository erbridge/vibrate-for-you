import React from 'react';
import ReactNative from 'react-native';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';

import { createStore } from '../store';

import AppNavigator from './AppNavigator';

const store = createStore();

it('renders without crashing', () => {
  const rendered = renderer
    .create(<Provider store={store}><AppNavigator /></Provider>)
    .toJSON();
});
