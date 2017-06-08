export const getConversation = (state, index) =>
  state.chat.conversations[index];
export const getConversations = state => state.chat.conversations;
export const getStoryState = (state, index) =>
  state.chat.conversations[index].storyState;

export default { getConversation, getConversations, getStoryState };
