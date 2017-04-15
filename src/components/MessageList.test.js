import React from 'react';
import ReactNative from 'react-native';
import renderer from 'react-test-renderer';

import MessageList from './MessageList';

const defaultProps = { messages: [] };

it('renders without crashing', () => {
  const rendered = renderer.create(<MessageList {...defaultProps} />).toJSON();
});
