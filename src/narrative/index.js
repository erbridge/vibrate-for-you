import { Story } from 'inkjs';
import sleep from 'mz-modules/sleep';

import { EMOJI_RE } from '../utils/string';

import {
  addChoice,
  clearChoices,
  sendMessage,
  setChoices,
  setTyping,
  updateStoryState,
} from '../store/actions/chat';

import chatSelectors from '../store/selectors/chat';

const WAIT_CHOICE_RE = /^WAIT\((\d+)\)\s*(.*)/;

const STORIES = {
  test: require('./data/test.ink.json'),
};

const NARRATIVES = [];

export class Narrative {
  isProcessing = false;
  nextMessageWasChoice = false;
  skipNextTyping = false;

  stepCounter = 0;

  // TODO: Does this belong in the store?
  storyEvents = [];

  constructor(storyKey, store) {
    this.story = new Story(STORIES[storyKey]);

    this.story.BindExternalFunction('typing', seconds => {
      this.storyEvents.push({ type: 'typing', payload: seconds * 1000 });
    });

    this.story.BindExternalFunction('wait', seconds => {
      this.storyEvents.push({ type: 'wait', payload: seconds * 1000 });
    });

    this.store = store;
  }

  start(conversationIndex) {
    this.story.ResetState();

    const storyState = chatSelectors.getStoryState(
      this.store.getState(),
      conversationIndex,
    );

    if (storyState) {
      this.story.state.LoadJson(storyState);
    }

    return this._processStory(conversationIndex);
  }

  chooseChoice(choiceIndex, conversationIndex) {
    this.story.ChooseChoiceIndex(choiceIndex);
    this.store.dispatch(clearChoices({ index: conversationIndex }));

    this.nextMessageWasChoice = true;

    if (!this.isProcessing) {
      this._processStory(conversationIndex);
    }
  }

  async _processStory(conversationIndex) {
    await sleep(500);

    this.isProcessing = true;
    this.stepCounter++;

    this.store.dispatch(
      updateStoryState({
        index: conversationIndex,
        storyState: this.story.state.toJson(),
      }),
    );

    if (this.story.canContinue) {
      let text = this.story.Continue();

      const knotTags = this.story.state.currentPath
        ? this.story.TagsForContentAtPath(
            this.story.state.currentPath.head._name,
          ) || []
        : [];
      const tags = this.story.currentTags || [];

      if (knotTags.indexOf('debug') < 0 && tags.indexOf('debug') < 0) {
        let sender = 'npc';

        if (this.nextMessageWasChoice) {
          sender = 'player';

          this.nextMessageWasChoice = false;

          if (text.startsWith('WAIT')) {
            const [, , newText] = text.match(WAIT_CHOICE_RE);

            text = newText;
          }
        } else {
          await this._showTyping(text, conversationIndex);
        }

        if (text) {
          this.store.dispatch(
            sendMessage({ index: conversationIndex, sender, text }),
          );
        }
      }

      while (this.storyEvents.length) {
        await this._processEvent(this.storyEvents.shift(), conversationIndex);
      }

      await this._processStory(conversationIndex);
    } else {
      const delayedChoices = [];

      const choices = this.story.currentChoices.map(({ index, text }) => {
        if (text.startsWith('DEBUG')) {
          return null;
        }

        if (text.startsWith('WAIT')) {
          delayedChoices.push({ index, text });

          return null;
        }

        return { index, text };
      });

      choices = choices.filter(choice => choice);

      this.store.dispatch(setChoices({ index: conversationIndex, choices }));

      delayedChoices.forEach(({ index, text }) => {
        if (text.startsWith('WAIT')) {
          const [, delay, messageText] = text.match(WAIT_CHOICE_RE);

          // Note that we do not await it.
          this._delayChoice(
            { index, text: messageText },
            conversationIndex,
            delay * 1000,
          );
        }
      });

      this.isProcessing = false;
    }
  }

  async _processEvent({ type, payload }, conversationIndex) {
    switch (type) {
      case 'wait':
        console.log(`Waiting ${payload}ms`);

        await sleep(payload);

        break;
      case 'typing':
        await this._showTyping(payload, conversationIndex);

        break;
      default:
        // FIXME: Throw an error?
        break;
    }
  }

  async _showTyping(textOrDuration, conversationIndex) {
    let duration = textOrDuration;

    if (typeof textOrDuration === 'string') {
      // Make the emoji typing duration consistent.
      duration = 250 * textOrDuration.replace(EMOJI_RE, '123456').length;
    }

    console.log(`Typing ${duration}ms`);

    this.store.dispatch(
      setTyping({ index: conversationIndex, typingState: 'active' }),
    );

    await sleep(duration);

    this.store.dispatch(
      setTyping({ index: conversationIndex, typingState: 'inactive' }),
    );
  }

  async _delayChoice(choice, conversationIndex, delay) {
    const stepCounter = this.stepCounter;

    // FIXME: Cancel these if a choice is made before they fire.
    await sleep(delay);

    if (this.stepCounter !== stepCounter) {
      return;
    }

    const { index, text } = choice;

    if (text) {
      this.store.dispatch(addChoice({ index: conversationIndex, choice }));
    } else {
      // FIXME: Execute the delay actions for the next knot before choosing it.
      this.chooseChoice(index, conversationIndex);
    }
  }
}

export const initNarratives = store => {
  Object.keys(STORIES).forEach(k => NARRATIVES[k] = new Narrative(k, store));
};

export const getNarrative = storyKey => NARRATIVES[storyKey];
