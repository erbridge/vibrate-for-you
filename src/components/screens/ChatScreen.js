import React, { Component, PropTypes } from 'react';
import {
  Animated,
  Button,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
    messageAppearScale: new Animated.Value(0),
    messageReadStateColour: new Animated.Value(0),
    messageReadStateScale: new Animated.Value(1),
    previousLastReadIndex: -1,
    previousMessageCount: 0,
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
    const {
      messageAppearScale,
      messageReadStateColour,
      messageReadStateScale,
      previousLastReadIndex,
      previousMessageCount,
    } = this.state;

    text = text.trim();

    let emoji;
    let outputText = [];
    let lastIndex = 0;

    while ((emoji = EMOJI_RE.exec(text)) !== null) {
      outputText.push(text.substring(lastIndex, emoji.index));
      outputText.push(<Emoji key={emoji.index} name={emoji[1]} />);

      lastIndex = emoji.index + emoji[0].length;
    }

    const style = {};
    const textStyle = {};

    if (sender === 'player') {
      style.transform = [{ scale: messageReadStateScale }];
      style.borderColor = 'rgba(170, 170, 170, 1)';
      style.backgroundColor = 'rgba(255, 255, 255, 1)';

      textStyle.color = 'rgba(170, 170, 170, 1)';

      if (index <= lastReadIndex) {
        style.borderColor = '#006680';

        if (index > previousLastReadIndex) {
          style.backgroundColor = messageReadStateColour.interpolate({
            inputRange: [0, 1],
            outputRange: ['rgba(255, 255, 255, 1)', 'rgba(0, 102, 128, 1)'],
            extrapolate: 'clamp',
          });
          textStyle.color = messageReadStateColour.interpolate({
            inputRange: [0, 1],
            outputRange: ['rgba(0, 102, 128, 1)', 'rgba(255, 255, 255, 1)'],
            extrapolate: 'clamp',
          });
        } else {
          delete style.transform;

          style.backgroundColor = '#006680';
          textStyle.color = '#fff';
        }
      } else if (index <= lastReceivedIndex) {
        style.borderColor = messageReadStateColour.interpolate({
          inputRange: [0, 1],
          outputRange: ['rgba(115, 115, 115, 1)', 'rgba(0, 102, 128, 1)'],
          extrapolate: 'clamp',
        });
        textStyle.color = messageReadStateColour.interpolate({
          inputRange: [0, 1],
          outputRange: ['rgba(115, 115, 115, 1)', 'rgba(0, 102, 128, 1)'],
          extrapolate: 'clamp',
        });
      } else if (index <= lastSentIndex) {
        style.borderColor = messageReadStateColour.interpolate({
          inputRange: [0, 1],
          outputRange: ['rgba(170, 170, 170, 1)', 'rgba(115, 115, 115, 1)'],
          extrapolate: 'clamp',
        });
        textStyle.color = messageReadStateColour.interpolate({
          inputRange: [0, 1],
          outputRange: ['rgba(170, 170, 170, 1)', 'rgba(115, 115, 115, 1)'],
          extrapolate: 'clamp',
        });
      }
    } else {
      // TODO: Should this animate all new messages, too?
      style.borderColor = 'rgba(128, 0, 0, 1)';
      style.backgroundColor = 'rgba(128, 0, 0, 1)';

      textStyle.color = 'rgba(255, 255, 255, 1)';

      if (index >= previousMessageCount) {
        style.transform = [{ scale: messageAppearScale }];
      }
    }

    const spacer = <View style={styles.messageSpacer} />;

    return (
      <View key={index} style={styles.messageContainer}>
        {sender === 'player' && spacer}
        <Animated.View style={[styles.message, style]}>
          <Animated.Text style={[styles.messageText, textStyle]}>
            {outputText.length ? outputText : text}
          </Animated.Text>
        </Animated.View>
        {sender !== 'player' && spacer}
      </View>
    );
  }

  renderChoice({ index, text }) {
    return (
      <View key={index} style={styles.choiceContainer}>
        <TouchableOpacity
          onPress={() => this.setState({ selectedChoiceIndex: index })}
          activeOpacity={0.8}
          style={styles.choice}
        >
          <Text>{text}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  componentWillReceiveProps(nextProps) {
    this.updateNavigationTitle(nextProps);

    const {
      messageAppearScale,
      messageReadStateColour,
      messageReadStateScale,
    } = this.state;

    if (
      nextProps.conversation.lastReadIndex !==
        this.props.conversation.lastReadIndex ||
      nextProps.conversation.lastReceivedIndex !==
        this.props.conversation.lastReceivedIndex ||
      nextProps.conversation.lastSentIndex !==
        this.props.conversation.lastSentIndex
    ) {
      messageReadStateColour.setValue(0);
      messageReadStateScale.setValue(1);

      Animated.stagger(250, [
        Animated.sequence([
          Animated.timing(messageReadStateScale, {
            toValue: 1.05,
            duration: 500,
            easing: Easing.quad,
          }),
          Animated.timing(messageReadStateScale, {
            toValue: 1,
            duration: 250,
            easing: Easing.elastic(2),
          }),
        ]),
        Animated.timing(messageReadStateColour, {
          toValue: 1,
          duration: 500,
          easing: Easing.inOut(Easing.quad),
        }),
      ]).start();
    }

    if (
      nextProps.conversation.lastReadIndex !==
      this.props.conversation.lastReadIndex
    ) {
      this.setState({
        previousLastReadIndex: this.props.conversation.lastReadIndex,
      });
    }

    if (
      nextProps.conversation.messages.length !==
      this.props.conversation.messages.length
    ) {
      messageAppearScale.setValue(0);

      Animated.timing(messageAppearScale, {
        toValue: 1,
        duration: 500,
        easing: Easing.elastic(1),
      }).start();

      this.setState({
        previousMessageCount: this.props.conversation.messages.length,
      });
    }
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
          {choices.map(choice => this.renderChoice(choice))}
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
    flex: 5,
    borderWidth: 3,
    borderStyle: 'solid',
    borderRadius: 15,
    padding: 10,
  },
  messageText: {
    fontSize: 18,
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
  choiceContainer: {
    padding: 10,
  },
  choice: {
    borderRadius: 15,
    padding: 10,
    backgroundColor: '#fff',

    // Android only
    elevation: 1,
  },
});

const mapStateToProps = (
  state,
  { navigation: { state: { params: { index } } } },
) => ({
  conversation: chatSelectors.getConversation(state, index),
});

export default connect(mapStateToProps)(ChatScreen);
