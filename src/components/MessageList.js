import sleep from 'mz-modules/sleep';
import React, { Component } from 'react';
import {
  Animated,
  Button,
  Easing,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Emoji from 'react-native-emoji';

import * as colours from '../constants/colours';

import { EMOJI_RE } from '../utils/string';

import jumpButtonIcon from '../assets/message-list/jump-button-icon.png';

const SCROLL_THRESHOLD = 20;

export default class MessageList extends Component {
  state = {
    messageAppearScale: new Animated.Value(0),
    messageReadStateColour: new Animated.Value(0),
    messageReadStateScale: new Animated.Value(1),
    previousLastReadIndex: -1,
    previousMessageCount: 0,
    scrolledToEnd: true,
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

    let emoji = EMOJI_RE.exec(text);
    let outputText = [];
    let lastIndex = 0;

    while (emoji !== null) {
      outputText.push(text.substring(lastIndex, emoji.index));
      outputText.push(<Emoji key={emoji.index} name={emoji[1]} />);

      lastIndex = emoji.index + emoji[0].length;

      emoji = EMOJI_RE.exec(text);
    }

    if (outputText.length) {
      outputText.push(text.substring(lastIndex));
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
    const { scrolledToEnd } = this.state;

    let messageList;

    return (
      <View style={styles.container}>
        <ScrollView
          ref={node => {
            messageList = node;
          }}
          onContentSizeChange={() =>
            scrolledToEnd && messageList.scrollToEnd({ animated: true })}
          onScroll={(
            { nativeEvent: { contentOffset, contentSize, layoutMeasurement } },
          ) =>
            this.setState({
              scrolledToEnd: layoutMeasurement.height +
                contentOffset.y +
                SCROLL_THRESHOLD >=
                contentSize.height,
            })}
        >
          {name &&
            <View style={styles.systemMessageContainer}>
              <View style={styles.systemMessageSpacer} />
              <View>
                <Text style={styles.systemMessageText}>
                  You've matched with {name}.
                  Start chatting!
                </Text>
              </View>
              <View style={styles.systemMessageSpacer} />
            </View>}
          {messages.map((message, i) => this.renderText(message, i))}
          {typingState === 'active' &&
            <Text style={styles.typingIndicator}>{name} is typing...</Text>}
        </ScrollView>
        {!scrolledToEnd &&
          <TouchableOpacity
            onPress={() => messageList.scrollToEnd({ animated: true })}
            style={styles.jumpButtonContainer}
          >
            <Image source={jumpButtonIcon} style={styles.jumpButton} />
          </TouchableOpacity>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
  },
  systemMessageContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: colours.SYSTEM_MESSAGE_BACKGROUND_COLOUR,
  },
  systemMessageSpacer: {
    flex: 1,
  },
  systemMessageText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: colours.SYSTEM_MESSAGE_TEXT_COLOUR,
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
  jumpButtonContainer: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  jumpButton: {
    width: 342 / 192 * 14, // The source image is 342 x 192.
    height: 14,
    tintColor: colours.JUMP_BUTTON_TINT_COLOUR,
  },
});
