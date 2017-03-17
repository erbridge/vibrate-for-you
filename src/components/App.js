import { Constants } from 'expo';
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

import AppNavigator from './AppNavigator';

export default class App extends Component {
  render() {
    return <AppNavigator {...this.props} style={styles.container} />;
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
  },
});
