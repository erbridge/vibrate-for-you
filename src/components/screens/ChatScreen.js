import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';

import { getNarrative } from '../../narrative';

import chatSelectors from '../../store/selectors/chat';

import Keyboard from '../Keyboard';
import MessageList from '../MessageList';

export class ChatScreen extends Component {
  static navigationOptions = {
    title: ({ state: { params: { name } } }) =>
      `Chat${name ? ` with ${name}` : ''}`,
  };

  constructor(...args) {
    super(...args);

    // FIXME: Determine which narrative to use.
    this.narrative = getNarrative('test');
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

  componentDidMount() {
    const { navigation: { state: { params: { index } } } } = this.props;

    this.narrative.start(index);
  }

  render() {
    const {
      conversation: {
        choices,
        lastReadIndex,
        lastReceivedIndex,
        messages,
        typingState,
      },
      navigation: { state: { params: { index: conversationIndex, name } } },
    } = this.props;

    return (
      <View style={styles.container}>
        <MessageList
          lastReadIndex={lastReadIndex}
          lastReceivedIndex={lastReceivedIndex}
          messages={messages}
          name={name}
          typingState={typingState}
        />
        <Keyboard
          choices={choices}
          submitChoice={selectedIndex =>
            this.narrative.chooseChoice(selectedIndex, conversationIndex)}
          collapsed
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const mapStateToProps = (
  state,
  { navigation: { state: { params: { index } } } },
) => ({
  conversation: chatSelectors.getConversation(state, index),
});

export default connect(mapStateToProps)(ChatScreen);
