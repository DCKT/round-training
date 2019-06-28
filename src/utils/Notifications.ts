import { Notifications } from "expo"
import { Platform } from "react-native"

export const dismissNotifications = () => {
  if (Platform.OS === "android") {
    return Notifications.dismissAllNotificationsAsync()
  } else {
    return Promise.resolve()
  }
}
