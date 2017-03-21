import { Story } from 'inkjs';
import sleep from 'mz-modules/sleep';

import {
  clearChoices,
  sendMessage,
  setChoices,
  updateStoryState,
} from '../store/actions/chat';

import chatSelectors from '../store/selectors/chat';

const STORIES = {
  test: require('./data/test.ink.json'),
};

const NARRATIVES = [];

export class Narrative {
  isProcessing = false;
  nextMessageWasChoice = false;

  constructor(storyKey, store) {
    this.story = new Story(STORIES[storyKey]);

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
    this.isProcessing = true;

    this.store.dispatch(
      updateStoryState({
        index: conversationIndex,
        storyState: this.story.state.toJson(),
      }),
    );

    if (this.story.canContinue) {
      const text = this.story.Continue();
      const knotTags = this.story.TagsForContentAtPath(
        this.story.state.currentPath,
      ) || [];
      const tags = this.story.currentTags || [];

      if (knotTags.indexOf('debug') < 0 && tags.indexOf('debug') < 0) {
        let sender = 'npc';

        if (this.nextMessageWasChoice) {
          sender = 'player';

          this.nextMessageWasChoice = false;
        } else {
          const typingDuration = 250 * text.length;

          // TODO: Show typing, too.
          await sleep(typingDuration);
        }

        this.store.dispatch(
          sendMessage({ index: conversationIndex, sender, text }),
        );
      }

      await this._processStory(conversationIndex);
    } else {
      const choices = this.story.currentChoices.map(({ index, text }) => {
        if (text.startsWith('DEBUG')) {
          return null;
        }

        return { index, text };
      });

      choices = choices.filter(choice => choice);

      this.store.dispatch(setChoices({ index: conversationIndex, choices }));

      this.isProcessing = false;
    }
  }
}

export const initNarratives = store => {
  Object.keys(STORIES).forEach(k => NARRATIVES[k] = new Narrative(k, store));
};

export const getNarrative = storyKey => NARRATIVES[storyKey];
