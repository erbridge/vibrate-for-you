import React, { Component } from 'react';
import { Button, StyleSheet, View } from 'react-native';

export default class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Finder',
  };

  render() {
    const { navigation: { navigate } } = this.props;

    return (
      <View style={styles.container}>
        <Button
          title="Start chatting"
          onPress={() => navigate('Chat', { index: 0 })}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
