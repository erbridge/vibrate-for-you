import React from 'react';
import ReactNative from 'react-native';
import renderer from 'react-test-renderer';

import AppNavigator from './AppNavigator';

it('renders without crashing', () => {
  const rendered = renderer.create(<AppNavigator />).toJSON();
});
