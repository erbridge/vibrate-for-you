jest.mock('expo', () => ({ Constants: { statusBarHeight: 0 } }));

import React from 'react';
import ReactNative from 'react-native';
import renderer from 'react-test-renderer';

import App from './App';

it('renders without crashing', () => {
  const rendered = renderer.create(<App />).toJSON();
});
