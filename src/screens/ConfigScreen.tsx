import React from "react"
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native"
import { Button, Card, Title, Paragraph } from "react-native-paper"
import { AppLoading } from "expo"
import { Asset } from "expo-asset"
import Slider from "react-native-slider"
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
  SafeAreaView
} from "react-navigation"
import i18n from "../locales"

const cacheResourcesAsync = () => {
  const sounds = [
    require("../../assets/sounds/rest.mp3"),
    require("../../assets/sounds/roundEnd.mp3")
  ]

  const cacheResources = sounds.map(sound => {
    return Asset.fromModule(sound).downloadAsync()
  })
  return Promise.all(cacheResources)
}

interface ConfigScreenProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

export default function ConfigScreen({ navigation }: ConfigScreenProps) {
  const [isAppReady, setAppReady] = React.useState(false)
  const [numberOfRound, setNumberOfRound] = React.useState(5)
  const [roundDuration, setRoundDuration] = React.useState(3)
  const [restDuration, setRestDuration] = React.useState(60)

  if (!isAppReady) {
    return (
      <AppLoading
        startAsync={cacheResourcesAsync}
        onFinish={() => setAppReady(true)}
        onError={console.warn}
      />
    )
  }

  return (
    <SafeAreaView style={styles.root}>
      <Card>
        <Card.Content>
          <Image
            source={require("../../assets/gloves.png")}
            style={styles.image}
          />
          <View>
            <Title style={styles.title}>
              {i18n.t("screens.config.numberOfRound")} {numberOfRound}
            </Title>
            <Slider
              value={numberOfRound}
              onValueChange={setNumberOfRound}
              minimumValue={1}
              maximumValue={10}
              step={1}
            />
          </View>

          <View>
            <Title style={styles.title}>
              {i18n.t("screens.config.roundDuration")} {roundDuration} min
            </Title>
            <Slider
              value={roundDuration}
              onValueChange={setRoundDuration}
              minimumValue={1}
              maximumValue={10}
              step={1}
            />
          </View>

          <View>
            <Title style={styles.title}>
              {i18n.t("screens.config.restDuration")}{" "}
              {i18n.t("utils.seconds", { value: restDuration })}
            </Title>
            <Slider
              value={restDuration}
              onValueChange={setRestDuration}
              minimumValue={30}
              maximumValue={180}
              step={15}
            />
          </View>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            dark
            color="#FF595A"
            onPress={() => {
              navigation.navigate("timer", {
                numberOfRound,
                roundDuration: roundDuration * 60,
                restDuration
              })
            }}
            style={styles.submitBtn}
          >
            <Text>{i18n.t("screens.config.startTraining")}</Text>
          </Button>
        </Card.Actions>
      </Card>
      <TouchableOpacity
        style={{ position: "absolute", bottom: 50, alignSelf: "center" }}
        onPress={() => navigation.navigate("credits")}
      >
        <Paragraph style={styles.link}>
          {i18n.t("screens.config.credits")}
        </Paragraph>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    padding: 20
  },
  submitBtn: { flex: 1, marginTop: 20 },
  image: {
    flex: 0,
    width: 150,
    height: 150,
    alignSelf: "center",
    resizeMode: "contain",
    marginBottom: 30
  },
  title: { textAlign: "center" },
  link: { color: "#62b1ef", fontSize: 20 }
})
