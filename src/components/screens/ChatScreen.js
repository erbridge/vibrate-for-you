import { Constants } from 'expo';
import React, { Component } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// FIXME: This has been pulled out of react-navigation's source,
//        but should be derived from the actual header's height.
const HEADER_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

export default class ChatScreen extends Component {
  static navigationOptions = {
    title: ({ state }) => `Chat with ${state.params.name}`,
  };

  state = {
    inputHeight: 0,
  };

  render() {
    const { inputHeight } = this.state;

    return (
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={HEADER_HEIGHT + Constants.statusBarHeight}
        style={styles.container}
      >
        <ScrollView style={styles.messageContainer}>
          <Text style={styles.message}>Hi!</Text>
        </ScrollView>
        <View style={[styles.inputContainer, { height: inputHeight }]}>
          <TextInput
            placeholder="Your message..."
            multiline
            returnKeyType="send"
            onContentSizeChange={(
              { nativeEvent: { contentSize: { height } } },
            ) => this.setState({ inputHeight: height })}
            underlineColorAndroid="transparent"
            style={styles.input}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  messageContainer: {
    flex: 1,
  },
  message: {
    padding: 5,
    fontSize: 18,
  },
  inputContainer: {
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 24,
  },
});
