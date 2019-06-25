import React from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { Svg, Circle } from 'react-native-svg'
import { Audio } from 'expo-av'
import { Caption, Card, Title, Headline } from 'react-native-paper'
import { Notifications } from 'expo'
import Countdown from '../components/Countdown'
import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation'
import { AnimatedCircularProgress } from 'react-native-circular-progress'

const roundSound = new Audio.Sound()
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 15,
    justifyContent: 'center'
  },
  title: {
    textAlign: 'center'
  },
  svg: { marginTop: 30, alignSelf: 'center' }
})

enum ActionType {
  RoundStarting = 'round_starting',
  RoundStarted = 'round_started',
  RoundEnd = 'round_end',
  DecreaseCountdown = 'decrease_counter'
}

enum CountdownType {
  Initial = 'initial',
  Round = 'round',
  Rest = 'rest'
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
  const restDuration = navigation.getParam('restDuration') || 5
  const numberOfRound = navigation.getParam('numberOfRound') || 2
  const roundDuration = navigation.getParam('roundDuration') || 10

  const [state, dispatch] = React.useReducer(reducer, {
    countdownType: CountdownType.Initial,
    intervalRef: undefined,
    countdown: 3,
    round: 0
  })

  React.useEffect(() => {
    if (!roundSound._loaded) {
      roundSound.loadAsync(require('../../assets/sounds/roundEnd.mp3'))
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

  React.useEffect(() => {
    Notifications.presentLocalNotificationAsync({
      title: `Round started !`,
      body: `Current round ${state.round}`,
      android: {
        sticky: true
      }
    })
  }, [state.round])

  React.useEffect(() => {
    if (state.countdown === 0) {
      const isLastRound = state.countdownType === 'rest' && state.round === numberOfRound
      let intervalRef = null
      clearInterval(state.intervalRef)

      if (!isLastRound) {
        intervalRef = setInterval(() => {
          dispatch({ type: ActionType.DecreaseCountdown })
        }, 1000)
      }

      if (state.countdownType === CountdownType.Initial) {
        dispatch({
          type: ActionType.RoundStarted,
          payload: {
            countdown: roundDuration,
            intervalRef
          }
        })
      } else if (state.countdownType === CountdownType.Round) {
        dispatch({
          type: ActionType.RoundEnd,
          payload: {
            countdown: restDuration,
            intervalRef
          }
        })
      } else if (state.countdownType === CountdownType.Rest) {
        if (state.round === numberOfRound) {
          roundSound.playAsync()
          alert('END')
        } else {
          dispatch({
            type: ActionType.RoundStarted,
            payload: {
              countdown: roundDuration,
              intervalRef
            }
          })
        }
      }
    }
  }, [state.countdown, state.countdownType])

  // if (state.countdownType === CountdownType.Initial && state.countdown > 0) {
  //   return <Countdown countdown={state.countdown} />
  // }

  // if (state.countdownType === CountdownType.Rest && state.countdown > 0) {
  return (
    <View style={styles.root}>
      <Card>
        <Card.Content>
          <Image
            source={require('../../assets/rest.png')}
            style={{
              width: 200,
              height: 200,
              margin: 10,
              alignSelf: 'center',
              resizeMode: 'contain',
              backgroundColor: '#fff'
            }}
          />
          <Title style={styles.title}>Rest time !</Title>
          <AnimatedCircularProgress
            size={100}
            width={5}
            prefill={100}
            rotation={0}
            fill={(state.countdown / restDuration) * 100}
            tintColor="#FF595A"
            backgroundColor="#3d5875"
            style={{ alignSelf: 'center', marginTop: 35 }}
          >
            {() => (
              <View>
                <Headline style={{ textAlign: 'center' }}>{state.countdown}</Headline>
              </View>
            )}
          </AnimatedCircularProgress>
        </Card.Content>
      </Card>
    </View>
  )
  // }

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
        fill={(state.countdown / roundDuration) * 100}
        tintColor="#FF595A"
        backgroundColor="#3d5875"
        style={{ alignSelf: 'center', marginTop: 35 }}
      >
        {() => (
          <View>
            <Headline style={{ textAlign: 'center' }}>{state.countdown}</Headline>
            <Title style={{ textAlign: 'center' }}>seconds</Title>
          </View>
        )}
      </AnimatedCircularProgress>
    </View>
  )
}
