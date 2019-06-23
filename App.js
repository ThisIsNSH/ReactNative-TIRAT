import { createStackNavigator, createAppContainer } from 'react-navigation';
import Main from './components/main/index';
import Translation from './components/translation/index';

const RootStack = createStackNavigator(
  {
    Main: { screen: Main ,
      navigationOptions: {
        header: null,
      },},
    Translation: { screen: Translation },
  },
  {
    initialRouteName: 'Main',
  }
);

const App = createAppContainer(RootStack);

export default App;