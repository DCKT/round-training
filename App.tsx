import ConfigScreen from "./src/screens/ConfigScreen"
import TimerScreen from "./src/screens/TimerScreen"
import { createStackNavigator, createAppContainer } from "react-navigation"

const AppNavigator = createStackNavigator(
  {
    config: {
      screen: ConfigScreen
    },
    timer: {
      screen: TimerScreen
    }
  },
  {
    headerMode: "none",
    initialRouteName: "timer"
  }
)

export default createAppContainer(AppNavigator)
