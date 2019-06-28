import React from "react"
import { View, StyleSheet, Image } from "react-native"
import { Audio } from "expo-av"
import { Caption, Card, Title, Text } from "react-native-paper"
import { Notifications } from "expo"
import CountdownFullScreen from "../components/CountdownFullScreen"
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
  NavigationActions,
  StackActions
} from "react-navigation"
import { AnimatedCircularProgress } from "react-native-circular-progress"
import { useKeepAwake } from "expo-keep-awake"
import RestCard from "../components/RestCard"
import { dismissNotifications } from "../utils/Notifications"

const roundSound = new Audio.Sound()
const restSound = new Audio.Sound()

enum ActionType {
  RoundStarting = "round_starting",
  RoundStarted = "round_started",
  RoundEnd = "round_end",
  DecreaseCountdown = "decrease_counter"
}

enum CountdownType {
  Initial = "initial",
  Round = "round",
  Rest = "rest"
}

interface State {
  countdownType: CountdownType
  intervalRef: undefined | number
  countdown: number
  round: number
}

interface Action {
  type: ActionType
  payload?: Object
}

function reducer(state: State, action: Action) {
  switch (action.type) {
    case ActionType.RoundStarting:
      return {
        ...state,
        ...action.payload,
        countdownType: CountdownType.Initial
      }
    case ActionType.RoundStarted:
      return {
        ...state,
        ...action.payload,
        countdownType: CountdownType.Round,
        round: state.round + 1
      }
    case ActionType.RoundEnd:
      return {
        ...state,
        ...action.payload,
        countdownType: CountdownType.Rest
      }
    case ActionType.DecreaseCountdown: {
      return {
        ...state,
        countdown: state.countdown - 1
      }
    }
    default:
      throw new Error()
  }
}

interface TimerProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

export default function Timer({ navigation }: TimerProps) {
  const restDuration = navigation.getParam("restDuration")
  const numberOfRound = navigation.getParam("numberOfRound")
  const roundDuration = navigation.getParam("roundDuration")

  const [state, dispatch] = React.useReducer(reducer, {
    countdownType: CountdownType.Initial,
    intervalRef: undefined,
    countdown: 3,
    round: 0
  })

  useKeepAwake()

  React.useEffect(() => {
    if (!roundSound._loaded) {
      roundSound.loadAsync(require("../../assets/sounds/roundEnd.mp3"))
    }

    if (!restSound._loaded) {
      restSound.loadAsync(require("../../assets/sounds/rest.mp3"))
    }

    dispatch({
      type: ActionType.RoundStarting,
      payload: {
        countdown: 3,
        intervalRef: setInterval(() => {
          dispatch({ type: ActionType.DecreaseCountdown })
        }, 1000)
      }
    })

    return () => {
      clearInterval(state.intervalRef)
    }
  }, [])

  React.useEffect(
    () => {
      if (state.round > 0) {
        dismissNotifications()
        Notifications.presentLocalNotificationAsync({
          title: `Round ${state.round}`,
          android: {
            sticky: true
          }
        })
      }

      return () => {
        dismissNotifications()
      }
    },
    [state.round]
  )

  React.useEffect(
    () => {
      if (state.countdown === 0) {
        const isLastRound =
          state.countdownType === "rest" && state.round === numberOfRound
        let intervalRef = null
        clearInterval(state.intervalRef)

        if (!isLastRound) {
          intervalRef = setInterval(() => {
            dispatch({ type: ActionType.DecreaseCountdown })
          }, 1000)
        }

        switch (state.countdownType) {
          case CountdownType.Initial:
            dispatch({
              type: ActionType.RoundStarted,
              payload: {
                countdown: roundDuration,
                intervalRef
              }
            })
            break
          case CountdownType.Round:
            restSound.replayAsync()
            dispatch({
              type: ActionType.RoundEnd,
              payload: {
                countdown: restDuration,
                intervalRef
              }
            })
            break
          case CountdownType.Rest:
            if (isLastRound) {
              roundSound.replayAsync()
              navigation.dispatch(
                StackActions.reset({
                  index: 0,
                  actions: [NavigationActions.navigate({ routeName: "config" })]
                })
              )
            } else {
              dispatch({
                type: ActionType.RoundStarted,
                payload: {
                  countdown: roundDuration,
                  intervalRef
                }
              })
            }
            break
        }
      }
    },
    [state.countdown, state.countdownType]
  )

  if (state.countdownType === CountdownType.Initial && state.countdown > 0) {
    return <CountdownFullScreen countdown={state.countdown} />
  }

  if (state.countdownType === CountdownType.Rest && state.countdown > 0) {
    return (
      <View style={styles.root}>
        <RestCard
          countdown={state.countdown}
          progress={state.countdown / restDuration * 100}
        />
      </View>
    )
  }

  return (
    <View style={styles.root}>
      <Card>
        <Card.Content>
          <Caption style={styles.title}>
            {state.round} / {numberOfRound}
          </Caption>
          <Title style={styles.title}>Round #{state.round}</Title>
        </Card.Content>
      </Card>
      <AnimatedCircularProgress
        size={300}
        width={10}
        prefill={100}
        rotation={0}
        fill={state.countdown / roundDuration * 100}
        tintColor="#FF595A"
        backgroundColor="#3d5875"
        style={{ alignSelf: "center", marginTop: 35 }}
      >
        {() => (
          <View>
            <Text style={{ fontSize: 50, textAlign: "center" }}>
              {state.countdown}
            </Text>
          </View>
        )}
      </AnimatedCircularProgress>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 15,
    justifyContent: "center"
  },
  title: {
    textAlign: "center"
  },
  svg: { marginTop: 30, alignSelf: "center" }
})
