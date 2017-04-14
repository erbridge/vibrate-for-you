import sleep from 'mz-modules/sleep';
import React, { Component } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default class Keyboard extends Component {
  state = {
    choiceAnimationIndex: 0,
    inputBuffer: '',
    selectedChoiceIndex: null,
  };

  async selectChoice(index, skipAnimation) {
    const { choices } = this.props;
    const { selectedChoiceIndex } = this.state;
    let { choiceAnimationIndex } = this.state;
    let { inputBuffer } = this.state;

    choiceAnimationIndex++;

    this.setState({ choiceAnimationIndex });

    let targetText = '';

    if (index !== null && index !== undefined) {
      const choice = choices.find(({ index: i }) => i === index);

      if (choice) {
        targetText = choice.text;
      }
    } else if (skipAnimation && selectedChoiceIndex !== null) {
      this.setState({ inputBuffer: targetText, selectedChoiceIndex: null });

      return;
    }

    if (inputBuffer === targetText) {
      this.setState({ selectedChoiceIndex: index });

      return;
    }

    while (inputBuffer.length && !targetText.startsWith(inputBuffer)) {
      inputBuffer = inputBuffer.slice(0, -1);

      this.setState({ inputBuffer });

      await sleep(10);

      if (this.state.choiceAnimationIndex !== choiceAnimationIndex) {
        return;
      }
    }

    while (inputBuffer.length < targetText.length) {
      inputBuffer = targetText.substring(0, inputBuffer.length + 1);

      this.setState({ inputBuffer });

      await sleep(50);

      if (this.state.choiceAnimationIndex !== choiceAnimationIndex) {
        return;
      }
    }

    this.setState({ selectedChoiceIndex: index });
  }

  submitChoice() {
    const { choices, submitChoice } = this.props;
    const { selectedChoiceIndex } = this.state;

    if (selectedChoiceIndex === null) {
      return;
    }

    const choice = choices.find(({ index: i }) => i === selectedChoiceIndex);

    if (!choice) {
      return;
    }

    const text = choice.text;

    submitChoice(selectedChoiceIndex);

    this.selectChoice(null, true);
  }

  renderChoice({ index, text }) {
    return (
      <View key={index} style={styles.choiceContainer}>
        <TouchableOpacity
          onPress={() => this.selectChoice(index)}
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
    const { selectedChoiceIndex } = this.state;

    if (selectedChoiceIndex !== null) {
      const choice = this.props.choices.find(
        ({ index }) => index === selectedChoiceIndex,
      );

      if (choice) {
        const nextChoice = nextProps.choices.find(
          ({ index }) => index === selectedChoiceIndex,
        );

        if (!nextChoice || choice.text !== nextChoice.text) {
          const replacementChoice = nextProps.choices.find(
            ({ text }) => text === choice.text,
          );

          if (replacementChoice) {
            this.setState({ selectedChoiceIndex: replacementChoice.index });
          } else {
            // FIXME: It shouldn't be necessary to skip the animation here...
            this.selectChoice(null, true);
          }
        }
      } else {
        this.selectChoice(null);
      }
    }
  }

  render() {
    const { choices } = this.props;
    const { inputBuffer } = this.state;

    return (
      <View>
        <View style={styles.inputContainer}>
          <Text
            style={
              inputBuffer
                ? styles.input
                : [styles.input, styles.inputPlaceholder]
            }
          >
            {inputBuffer || 'Your message...'}
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
              onPress={() => this.selectChoice(null)}
              color="#c62828"
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgb(203, 203, 203)',
    backgroundColor: 'rgb(255, 255, 255)',
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
    backgroundColor: 'rgb(228, 230, 233)',
  },
  choiceContainer: {
    paddingBottom: 10,
  },
  choice: {
    borderRadius: 15,
    padding: 10,
    backgroundColor: 'rgb(255, 255, 255)',

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
