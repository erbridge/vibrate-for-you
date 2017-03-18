import { StackNavigator } from 'react-navigation';

import ChatScreen from './screens/ChatScreen';
import HomeScreen from './screens/HomeScreen';

export default StackNavigator({
  Home: { screen: HomeScreen },
  Chat: { screen: ChatScreen },
});
