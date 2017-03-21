export const getConversation = (state, index) =>
  state.chat.conversations[index];
export const getStoryState = (state, index) =>
  state.chat.conversations[index].storyState;

export default { getConversation, getStoryState };
