import React from "react"
import { View, StyleSheet, Animated } from "react-native"

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 15
  },
  rootCentered: {
    justifyContent: "center",
    alignItems: "center"
  },
  countdown: {
    fontSize: 68,
    transform: [{ scale: 2 }]
  }
})

interface CountdownProps {
  countdown: number
}

export default function Countdown({ countdown }: CountdownProps) {
  const unscaleAnim = new Animated.Value(3)

  React.useEffect(
    () => {
      Animated.timing(unscaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }).start()
    },
    [countdown]
  )

  return (
    <Animated.View style={[styles.root, styles.rootCentered]}>
      <Animated.Text
        style={[styles.countdown, { transform: [{ scale: unscaleAnim }] }]}
      >
        {countdown}
      </Animated.Text>
    </Animated.View>
  )
}
