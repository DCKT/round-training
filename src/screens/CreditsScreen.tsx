import React from "react"
import { View, TouchableOpacity, Linking, StyleSheet } from "react-native"
import { Headline, IconButton, Paragraph, Card } from "react-native-paper"
import {
  SafeAreaView,
  NavigationParams,
  NavigationScreenProp,
  NavigationState
} from "react-navigation"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import i18n from "../locales"

const iconCreditLink =
  "https://www.freepik.com/?__hstc=57440181.51553f89e44a6464f95ce39bbb7b4e28.1561411430862.1561747601199.1561920013523.3&__hssc=57440181.2.1561920013523&__hsfp=1976050658"
const soundCreditLink = "http://soundbible.com/"
const twitterLink = "https://twitter.com/DCK__"
const githubLink = "https://github.com/DCKT"

interface CreditsScreenProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

export default function CreditsScreen({ navigation }: CreditsScreenProps) {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.root}>
        <IconButton
          style={styles.backButton}
          icon="arrow-back"
          onPress={() => navigation.goBack()}
        />
        <Headline style={styles.headerTitle}>
          {i18n.t("screens.credits.title")}
        </Headline>
      </View>
      <Card style={styles.card}>
        <Card.Content>
          <Headline>{i18n.t("screens.credits.pictures")}</Headline>
          <TouchableOpacity onPress={() => Linking.openURL(iconCreditLink)}>
            <Paragraph style={styles.link}>
              Icon made by Freepik from www.flaticon.com
            </Paragraph>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Headline>{i18n.t("screens.credits.sounds")}</Headline>
          <TouchableOpacity onPress={() => Linking.openURL(soundCreditLink)}>
            <Paragraph style={styles.link}>
              Sounds provided by soundbible
            </Paragraph>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Headline>{i18n.t("screens.credits.appDevelopment")}</Headline>
          <TouchableOpacity onPress={() => Linking.openURL(githubLink)}>
            <Paragraph style={styles.link}>
              {i18n.t("screens.credits.developedBy", {
                name: "Thomas Deconinck"
              })}
            </Paragraph>
          </TouchableOpacity>
          <View style={styles.socials}>
            <IconButton
              icon={props => (
                <MaterialCommunityIcons {...props} name="twitter-circle" />
              )}
              size={48}
              style={styles.socialIcon}
              color={"#00acee"}
              onPress={() => Linking.openURL(twitterLink)}
            />

            <IconButton
              icon={props => (
                <MaterialCommunityIcons {...props} name="github-circle" />
              )}
              size={48}
              style={styles.socialIcon}
              color={"#000"}
              onPress={() => Linking.openURL(githubLink)}
            />
          </View>
        </Card.Content>
      </Card>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15
  },
  root: {
    flex: 0,
    flexDirection: "row",
    alignItems: "center"
  },
  backButton: {
    flex: 0,
    marginRight: 20
  },
  headerTitle: {
    flex: 1
  },
  link: {
    width: 150,
    color: "#62b1ef",
    textDecorationLine: "underline"
  },
  card: { marginBottom: 15 },
  socials: {
    flex: 0,
    flexDirection: "row",
    alignItems: "center"
  },
  socialIcon: { width: 48, height: 48 }
})
