import sleep from 'mz-modules/sleep';
import React, { Component } from 'react';
import {
  Animated,
  Button,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Emoji from 'react-native-emoji';

import * as colours from '../constants/colours';

import { EMOJI_RE } from '../utils/string';

export default class MessageList extends Component {
  state = {
    messageAppearScale: new Animated.Value(0),
    messageReadStateColour: new Animated.Value(0),
    messageReadStateScale: new Animated.Value(1),
    previousLastReadIndex: -1,
    previousMessageCount: 0,
  };

  renderText({ sender, text }, index) {
    const { lastReadIndex, lastReceivedIndex } = this.props;
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

      style.borderColor = colours.PLAYER_SENT_MESSAGE_BORDER_COLOUR;
      style.backgroundColor = colours.PLAYER_SENT_MESSAGE_BACKGROUND_COLOUR;

      textStyle.color = colours.PLAYER_SENT_MESSAGE_TEXT_COLOUR;

      if (index <= lastReadIndex) {
        if (index > previousLastReadIndex) {
          style.borderColor = messageReadStateColour.interpolate({
            inputRange: [0, 1],
            outputRange: [
              colours.PLAYER_RECEIVED_MESSAGE_BORDER_COLOUR,
              colours.PLAYER_READ_MESSAGE_BORDER_COLOUR,
            ],
            extrapolate: 'clamp',
          });
          style.backgroundColor = messageReadStateColour.interpolate({
            inputRange: [0, 1],
            outputRange: [
              colours.PLAYER_RECEIVED_MESSAGE_BACKGROUND_COLOUR,
              colours.PLAYER_READ_MESSAGE_BACKGROUND_COLOUR,
            ],
            extrapolate: 'clamp',
          });

          textStyle.color = messageReadStateColour.interpolate({
            inputRange: [0, 1],
            outputRange: [
              colours.PLAYER_RECEIVED_MESSAGE_TEXT_COLOUR,
              colours.PLAYER_READ_MESSAGE_TEXT_COLOUR,
            ],
            extrapolate: 'clamp',
          });
        } else {
          delete style.transform;

          style.borderColor = colours.PLAYER_READ_MESSAGE_BORDER_COLOUR;
          style.backgroundColor = colours.PLAYER_READ_MESSAGE_BACKGROUND_COLOUR;

          textStyle.color = colours.PLAYER_READ_MESSAGE_TEXT_COLOUR;
        }
      } else if (index <= lastReceivedIndex) {
        style.borderColor = messageReadStateColour.interpolate({
          inputRange: [0, 1],
          outputRange: [
            colours.PLAYER_SENT_MESSAGE_BORDER_COLOUR,
            colours.PLAYER_RECEIVED_MESSAGE_BORDER_COLOUR,
          ],
          extrapolate: 'clamp',
        });
        style.backgroundColor = messageReadStateColour.interpolate({
          inputRange: [0, 1],
          outputRange: [
            colours.PLAYER_SENT_MESSAGE_BACKGROUND_COLOUR,
            colours.PLAYER_RECEIVED_MESSAGE_BACKGROUND_COLOUR,
          ],
          extrapolate: 'clamp',
        });

        textStyle.color = messageReadStateColour.interpolate({
          inputRange: [0, 1],
          outputRange: [
            colours.PLAYER_SENT_MESSAGE_TEXT_COLOUR,
            colours.PLAYER_RECEIVED_MESSAGE_TEXT_COLOUR,
          ],
          extrapolate: 'clamp',
        });
      }
    } else {
      style.borderColor = colours.NPC_MESSAGE_BORDER_COLOUR;
      style.backgroundColor = colours.NPC_MESSAGE_BACKGROUND_COLOUR;

      textStyle.color = colours.NPC_MESSAGE_TEXT_COLOUR;

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

  componentWillReceiveProps(nextProps) {
    const {
      messageAppearScale,
      messageReadStateColour,
      messageReadStateScale,
    } = this.state;

    if (
      nextProps.lastReadIndex !== this.props.lastReadIndex ||
      nextProps.lastReceivedIndex !== this.props.lastReceivedIndex
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

    if (nextProps.lastReadIndex !== this.props.lastReadIndex) {
      this.setState({
        previousLastReadIndex: this.props.lastReadIndex,
      });
    }

    if (nextProps.messages.length !== this.props.messages.length) {
      messageAppearScale.setValue(0);

      Animated.timing(messageAppearScale, {
        toValue: 1,
        duration: 500,
        easing: Easing.elastic(1),
      }).start();

      this.setState({
        previousMessageCount: this.props.messages.length,
      });
    }
  }

  componentWillMount() {
    const {
      messageAppearScale,
      messageReadStateColour,
      messageReadStateScale,
    } = this.state;

    messageAppearScale.setValue(1);
    messageReadStateColour.setValue(1);
    messageReadStateScale.setValue(1);
  }

  render() {
    const { messages, name, typingState } = this.props;

    return (
      <ScrollView style={styles.container}>
        {messages.map((message, i) => this.renderText(message, i))}
        {typingState === 'active' &&
          <Text style={styles.typingIndicator}>{name} is typing...</Text>}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
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
});
