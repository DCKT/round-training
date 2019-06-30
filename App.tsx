import ConfigScreen from "./src/screens/ConfigScreen"
import TimerScreen from "./src/screens/TimerScreen"
import CreditsScreen from "./src/screens/CreditsScreen"
import { createStackNavigator, createAppContainer } from "react-navigation"

const AppNavigator = createStackNavigator(
  {
    config: {
      screen: ConfigScreen
    },
    timer: {
      screen: TimerScreen
    },
    credits: {
      screen: CreditsScreen
    }
  },
  {
    headerMode: "none",
    initialRouteName: "config"
  }
)

export default createAppContainer(AppNavigator)
