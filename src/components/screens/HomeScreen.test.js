import React from 'react';
import ReactNative from 'react-native';
import renderer from 'react-test-renderer';

import { HomeScreen } from './HomeScreen';

const defaultProps = { conversations: [], navigation: { navigate: jest.fn() } };

it('renders without crashing', () => {
  const rendered = renderer.create(<HomeScreen {...defaultProps} />).toJSON();
});
