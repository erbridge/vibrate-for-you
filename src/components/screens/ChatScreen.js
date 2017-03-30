import React, { Component, PropTypes } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import Emoji from 'react-native-emoji';
import { connect } from 'react-redux';

import { EMOJI_RE } from '../../utils/string';

import { getNarrative } from '../../narrative';

import chatSelectors from '../../store/selectors/chat';

export class ChatScreen extends Component {
  static navigationOptions = {
    title: ({ state: { params: { name } } }) =>
      `Chat${name ? ` with ${name}` : ''}`,
  };

  state = {
    selectedChoiceIndex: null,
  };

  constructor(...args) {
    super(...args);

    // FIXME: Determine which narrative to use.
    this.narrative = getNarrative('test');
  }

  submitChoice() {
    const {
      conversation: { choices },
      dispatch,
      navigation: { state: { params: { index } } },
    } = this.props;
    const { selectedChoiceIndex } = this.state;

    if (selectedChoiceIndex === null) {
      return;
    }

    const text = choices.find(({ index: i }) => i === selectedChoiceIndex).text;

    this.narrative.chooseChoice(selectedChoiceIndex, index);

    this.setState({ selectedChoiceIndex: null });
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

  renderText({ sender, text }, index) {
    const {
      conversation: { lastReadIndex, lastReceivedIndex, lastSentIndex },
    } = this.props;

    text = text.trim();

    let emoji;
    let outputText = [];
    let lastIndex = 0;

    while ((emoji = EMOJI_RE.exec(text)) !== null) {
      outputText.push(text.substring(lastIndex, emoji.index));
      outputText.push(<Emoji key={emoji.index} name={emoji[1]} />);

      lastIndex = emoji.index + emoji[0].length;
    }

    const style = sender === 'player'
      ? styles.playerMessage
      : styles.npcMessage;

    const textStyle = sender === 'player'
      ? styles.playerMessageText
      : styles.npcMessageText;

    let statusText;

    if (sender === 'player') {
      if (index <= lastReadIndex) {
        statusText = '(read)';
      } else if (index <= lastReceivedIndex) {
        statusText = '(received)';
      } else if (index <= lastSentIndex) {
        statusText = '(sent)';
      } else {
        statusText = '(pending)';
      }
    }

    const spacer = <View style={styles.messageSpacer} />;

    return (
      <View key={index} style={styles.messageContainer}>
        {sender === 'player' && spacer}
        <View style={[styles.message, style]}>
          <Text style={[styles.messageText, textStyle]}>
            {outputText.length ? outputText : text}
          </Text>
          {statusText &&
            <Text style={[styles.statusIndicator, textStyle]}>
              {statusText}
            </Text>}
        </View>
        {sender !== 'player' && spacer}
      </View>
    );
  }

  componentWillReceiveProps(nextProps) {
    this.updateNavigationTitle(nextProps);
  }

  componentWillMount() {
    this.updateNavigationTitle(this.props);
  }

  componentDidMount() {
    const { navigation: { state: { params: { index } } } } = this.props;

    this.narrative.start(index);
  }

  render() {
    const {
      conversation: { choices, messages, typingState },
      dispatch,
      navigation: { state: { params: { index: conversationIndex, name } } },
    } = this.props;
    const { selectedChoiceIndex } = this.state;

    let choiceText = 'Your message...';

    if (selectedChoiceIndex !== null) {
      choiceText = choices.find(
        ({ index }) => index === selectedChoiceIndex,
      ).text;
    }

    return (
      <View style={styles.container}>
        <ScrollView style={styles.messageList}>
          {messages.map((message, i) => this.renderText(message, i))}
          {typingState === 'active' &&
            <Text style={styles.typingIndicator}>{name} is typing...</Text>}
        </ScrollView>
        <View style={styles.inputContainer}>
          <Text
            style={
              selectedChoiceIndex === null
                ? [styles.input, styles.inputPlaceholder]
                : styles.input
            }
          >
            {choiceText}
          </Text>
          <View style={styles.submitButtonContainer}>
            <Button title="Send" onPress={() => this.submitChoice()} />
          </View>
        </View>
        <View>
          {choices.map(({ index, text }) => (
            <Button
              key={index}
              title={text}
              onPress={() => this.setState({ selectedChoiceIndex: index })}
            />
          ))}
          <Button
            title="Clear"
            onPress={() => this.setState({ selectedChoiceIndex: null })}
            color="#c62828"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageList: {
    flex: 1,
  },
  messageContainer: {
    padding: 5,
    flexDirection: 'row',
  },
  messageSpacer: {
    flex: 3,
  },
  message: {
    flex: 7,
    borderRadius: 5,
    padding: 10,
  },
  playerMessage: {
    backgroundColor: '#99f',
  },
  npcMessage: {
    backgroundColor: '#f99',
  },
  messageText: {
    fontSize: 18,
  },
  playerMessageText: {
    textAlign: 'right',
  },
  npcMessageText: {
    textAlign: 'left',
  },
  statusIndicator: {
    padding: 2,
    fontSize: 10,
    fontStyle: 'italic',
  },
  typingIndicator: {
    padding: 10,
    fontSize: 14,
    fontStyle: 'italic',
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
  inputPlaceholder: {
    color: '#aaa',
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
