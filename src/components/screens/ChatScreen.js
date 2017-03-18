import { Constants } from 'expo';
import React, { Component } from 'react';
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import { sendMessage } from '../../store/actions/chat';

import chatSelectors from '../../store/selectors/chat';

// FIXME: This has been pulled out of react-navigation's source,
//        but should be derived from the actual header's height.
const HEADER_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

export class ChatScreen extends Component {
  static navigationOptions = {
    title: ({ state: { params: { name } } }) =>
      `Chat${name ? ` with ${name}` : ''}`,
  };

  state = {
    inputHeight: 0,
    pendingMessage: '',
  };

  sendPendingMessage() {
    const {
      dispatch,
      navigation: { state: { params: { index } } },
    } = this.props;
    const { pendingMessage } = this.state;

    if (!pendingMessage) {
      return;
    }

    dispatch(sendMessage({ index, sender: 'Me', text: pendingMessage }));

    this.setState({ pendingMessage: '' });
  }

  updateNavigationTitle(props) {
    const {
      conversation: { name },
      navigation: { setParams, state: { params: { name: oldName } } },
    } = props;

    if (oldName === name) {
      return;
    }

    setParams({ name });
  }

  componentWillReceiveProps(nextProps) {
    this.updateNavigationTitle(nextProps);
  }

  componentWillMount() {
    this.updateNavigationTitle(this.props);
  }

  render() {
    const { conversation: { messages }, dispatch } = this.props;
    const { inputHeight, pendingMessage } = this.state;

    return (
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={HEADER_HEIGHT + Constants.statusBarHeight}
        style={styles.container}
      >
        <ScrollView style={styles.messageContainer}>
          {messages.map(({ text }, i) => (
            <Text key={i} style={styles.message}>{text}</Text>
          ))}
        </ScrollView>
        <View style={[styles.inputContainer, { height: inputHeight }]}>
          <TextInput
            value={pendingMessage}
            placeholder="Your message..."
            multiline
            onChangeText={text => this.setState({ pendingMessage: text })}
            onContentSizeChange={(
              { nativeEvent: { contentSize: { height } } },
            ) => this.setState({ inputHeight: height })}
            underlineColorAndroid="transparent"
            style={styles.input}
          />
          <View style={styles.submitButtonContainer}>
            <Button title="Send" onPress={() => this.sendPendingMessage()} />
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 24,
  },
  submitButtonContainer: {
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = (
  state,
  { navigation: { state: { params: { index } } } },
) => ({
  conversation: chatSelectors.getConversation(state, index),
});

export default connect(mapStateToProps)(ChatScreen);
