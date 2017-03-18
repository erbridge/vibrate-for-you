jest.mock('expo', () => ({ Constants: { statusBarHeight: 0 } }));

import React from 'react';
import ReactNative from 'react-native';
import renderer from 'react-test-renderer';

import { createStore } from '../../store';

import { ChatScreen } from './ChatScreen';

const defaultProps = {
  conversation: { name: 'test', messages: [] },
  navigation: { setParams: jest.fn(), state: { params: { index: 0 } } },
};

it('renders without crashing', () => {
  const rendered = renderer.create(<ChatScreen {...defaultProps} />).toJSON();
});
