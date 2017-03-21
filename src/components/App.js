import { Constants } from 'expo';
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Provider } from 'react-redux';

import { initNarratives } from '../narrative';

import { createStore } from '../store';

import AppNavigator from './AppNavigator';

const store = createStore();

initNarratives(store);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppNavigator {...this.props} style={styles.container} />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
  },
});
