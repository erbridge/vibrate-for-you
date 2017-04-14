import React from 'react';
import ReactNative from 'react-native';
import renderer from 'react-test-renderer';

import Keyboard from './Keyboard';

const defaultProps = { choices: [] };

it('renders without crashing', () => {
  const rendered = renderer.create(<Keyboard {...defaultProps} />).toJSON();
});
