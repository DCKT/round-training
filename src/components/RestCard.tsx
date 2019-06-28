import React from "react"
import { View, Image, StyleSheet } from "react-native"
import { Card, Title, Headline } from "react-native-paper"
import { AnimatedCircularProgress } from "react-native-circular-progress"

const styles = StyleSheet.create({
  title: {
    textAlign: "center"
  },
  svg: { marginTop: 30, alignSelf: "center" }
})

interface RestCardProps {
  countdown: number
  progress: number
}

export default function RestCard({ countdown, progress }: RestCardProps) {
  return (
    <Card>
      <Card.Content>
        <Image
          source={require("../../assets/rest.png")}
          style={{
            width: 200,
            height: 200,
            margin: 10,
            alignSelf: "center",
            resizeMode: "contain",
            backgroundColor: "#fff"
          }}
        />
        <Title style={styles.title}>Rest time !</Title>
        <AnimatedCircularProgress
          size={100}
          width={5}
          prefill={100}
          rotation={0}
          fill={progress}
          duration={1000}
          tintColor="#FF595A"
          backgroundColor="#3d5875"
          style={{ alignSelf: "center", marginTop: 35 }}
        >
          {() => (
            <View>
              <Headline style={{ textAlign: "center" }}>{countdown}</Headline>
            </View>
          )}
        </AnimatedCircularProgress>
      </Card.Content>
    </Card>
  )
}
