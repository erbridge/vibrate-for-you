import React, { Component } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';

import { NAME_OPTIONS } from '../../constants/narrative';

import {
  clearAllConversations,
  startConversation,
} from '../../store/actions/chat';
import chatSelectors from '../../store/selectors/chat';

export class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Finder',
  };

  navigateToNewMatch() {
    const { conversations, dispatch } = this.props;

    const name = NAME_OPTIONS[Math.floor(Math.random() * NAME_OPTIONS.length)];

    // Only allow a single conversation for now.
    dispatch(clearAllConversations());
    dispatch(startConversation({ name }));

    this.navigateToChat(0, name);
  }

  navigateToChat(index, name) {
    const { navigation: { navigate } } = this.props;

    navigate('Chat', { index, name });
  }

  render() {
    const { conversations } = this.props;

    return (
      <View style={styles.container}>
        {conversations.map(({ name }, index) => (
          <View key={index} style={styles.buttonContainer}>
            <Button
              title={`Continue chatting with ${name}`}
              onPress={() => this.navigateToChat(index, name)}
            />
          </View>
        ))}
        <View style={styles.buttonContainer}>
          <Button
            title="Find a new match"
            onPress={() => this.navigateToNewMatch()}
          />
        </View>
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
  buttonContainer: {
    padding: 10,
  },
});

const mapStateToProps = state => ({
  conversations: chatSelectors.getConversations(state),
});

export default connect(mapStateToProps)(HomeScreen);
