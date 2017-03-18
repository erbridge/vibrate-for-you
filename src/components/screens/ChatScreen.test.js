jest.mock('expo', () => ({ Constants: { statusBarHeight: 0 } }));

import React from 'react';
import ReactNative from 'react-native';
import renderer from 'react-test-renderer';

import ChatScreen from './ChatScreen';

it('renders without crashing', () => {
  const rendered = renderer.create(<ChatScreen />).toJSON();
});
