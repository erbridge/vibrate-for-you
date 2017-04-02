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

    const choice = choices.find(({ index: i }) => i === selectedChoiceIndex);

    if (!choice) {
      return;
    }

    const text = choice.text;

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
      conversation: { lastReadIndex, lastReceivedIndex },
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
      style.borderColor = 'rgba(115, 115, 115, 1)';
      style.backgroundColor = 'rgba(255, 255, 255, 1)';

      textStyle.color = 'rgba(115, 115, 115, 1)';

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

  renderEmptyChoices(count) {
    const output = [];

    for (let i = 0; i < count; i++) {
      output.push(
        <View key={`empty-${i}`} style={styles.choiceContainer}>
          <View style={styles.emptyChoice}>
            <Text>&nbsp;</Text>
          </View>
        </View>,
      );
    }

    return output;
  }

  componentWillReceiveProps(nextProps) {
    this.updateNavigationTitle(nextProps);

    const {
      messageAppearScale,
      messageReadStateColour,
      messageReadStateScale,
      selectedChoiceIndex,
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

    if (selectedChoiceIndex !== null) {
      const choice = this.props.conversation.choices.find(
        ({ index }) => index === selectedChoiceIndex,
      );

      if (choice) {
        const nextChoice = nextProps.conversation.choices.find(
          ({ index }) => index === selectedChoiceIndex,
        );

        if (!nextChoice || choice.text !== nextChoice.text) {
          const replacementChoice = nextProps.conversation.choices.find(
            ({ text }) => text === choice.text,
          );

          if (replacementChoice) {
            this.setState({ selectedChoiceIndex: replacementChoice.index });
          } else {
            this.setState({ selectedChoiceIndex: null });
          }
        }
      } else {
        this.setState({ selectedChoiceIndex: null });
      }
    }
  }

  componentWillMount() {
    this.updateNavigationTitle(this.props);

    const {
      messageAppearScale,
      messageReadStateColour,
      messageReadStateScale,
    } = this.state;

    messageAppearScale.setValue(1);
    messageReadStateColour.setValue(1);
    messageReadStateScale.setValue(1);
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
      const choice = choices.find(({ index }) => index === selectedChoiceIndex);

      if (choice) {
        choiceText = choice.text;
      }
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
        <View style={styles.choiceList}>
          {choices.map(choice => this.renderChoice(choice))}
          {this.renderEmptyChoices(4 - choices.length)}
          <View style={styles.clearButtonContainer}>
            <Button
              title="Clear"
              onPress={() => this.setState({ selectedChoiceIndex: null })}
              color="#c62828"
            />
          </View>
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
    backgroundColor: '#fff',
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
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(203, 203, 203, 1)',
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
  choiceList: {
    padding: 10,
    paddingBottom: 0,
  },
  choiceContainer: {
    paddingBottom: 10,
  },
  choice: {
    borderRadius: 15,
    padding: 10,
    backgroundColor: '#fff',

    // Android only
    elevation: 1,
  },
  emptyChoice: {
    padding: 10,
  },
  clearButtonContainer: {
    paddingBottom: 10,
  },
});

const mapStateToProps = (
  state,
  { navigation: { state: { params: { index } } } },
) => ({
  conversation: chatSelectors.getConversation(state, index),
});

export default connect(mapStateToProps)(ChatScreen);
