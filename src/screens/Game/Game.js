import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as SplashScreen from 'expo-splash-screen';
import Dashboard from '../../components/dashboard';
import options from '../../../options.json';
import colors from '../../../colors';
import Table from '../../components/table';
import { useAtom, useAtomValue } from 'jotai';
import { store } from '../../store';
import useInterval from 'use-interval';
import { formatTime } from '../../utils';


export default function Game({ navigation }) {

  const [isPlay, setIsPlay] = useState(true)
  const [isFirst, setIsFirst] = useState(true)
  const [time, setTime] = useState(0)
  const difficulty = useAtomValue(store).difficulty
  const [numOfFlags, setNumOfFlag] = useState(0)
  const [numOfActiveMines, setNumOfActiveMines] = useState(options[difficulty].numberOfMine)
  const [data, setData] = useAtom(store)
  const isDarkMode = data.darkMode

  const [appIsReady, setAppIsReady] = useState(false)
  const [table, setTable] = useState([[]])

  function generateTable() {
    setIsPlay(true)
    setIsFirst(true)

    const field = new Array(options[difficulty].tableLength)

    for (let i = 0; i < options[difficulty].tableLength; ++i)
      field[i] = new Array(options[difficulty].tableLength)

    for (let i = 0; i < options[difficulty].tableLength; ++i) {
      for (let j = 0; j < options[difficulty].tableLength; ++j) {
        field[i][j] = {
          isMine: false,
          row: i,
          column: j,
          numberOfAdjacentMines: 0,
          isPressed: false,
          isFlagged: false,
        }
      }
    }

    return field
  }

  function onReset() {
    setTime(0)
    setTable(generateTable())
    setNumOfActiveMines(options[difficulty].numberOfMine)
    setNumOfFlag(0)
  }

  useEffect(() => {
    ;(async function prepare() {
      try {
        const dif = await AsyncStorage.getItem('Difficulty')
        if (dif !== null) {
          setData((d) => ({...d, difficulty: JSON.parse(dif)}))
        }
        const darkMode = await AsyncStorage.getItem('DarkMode')
        if (darkMode !== null) {
          setData((d) => ({...d, darkMode: JSON.parse(darkMode)}))
        }
        const records = await AsyncStorage.getItem('Records')
        if (records !== null) {
          setData((d) => ({...d, records: JSON.parse(records)}))
        }
        const vibration = await AsyncStorage.getItem('Vibration')
        if (vibration !== null) {
          setData((d) => ({...d, vibration: JSON.parse(vibration)}))
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    })()

    setTable(generateTable())
  }, []);

  useEffect(() => {
    setTable(generateTable())
    setNumOfActiveMines(options[difficulty].numberOfMine)
    setNumOfFlag(0)
  }, [difficulty])


  useInterval(() => setTime(t => t + 1), isPlay && !isFirst && 1000)

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ ...styles.container, backgroundColor: isDarkMode ? colors.dark : colors.white }}
      onLayout={onLayoutRootView} >

      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      <View style={styles.topSide}>

        <Pressable onPress={onReset}>
          <Image source={require("../../../assets/reset.png")} style={styles.icon(isDarkMode)} />
        </Pressable>

        <Text style={styles.timer(isDarkMode)}>{formatTime(time)}</Text>

        <Pressable onPress={() => navigation.navigate('Settings')} >
          <Image source={require("../../../assets/setting.png")} style={styles.icon(isDarkMode)} />
        </Pressable>

      </View>


      <Dashboard numOfFlags={numOfFlags} numOfActiveMines={numOfActiveMines} />

      <Table table={table} setTable={setTable} isFirst={isFirst} setIsFirst={setIsFirst}
        isPlay={isPlay} setIsPlay={setIsPlay} setNumOfFlag={setNumOfFlag} 
        setNumOfActiveMines={setNumOfActiveMines} time={time} />

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 25
  },

  timer: (darkMode) => ({
    color: darkMode ? colors.white : colors.dark,
    fontSize: 45,
    fontWeight: 'bold',
    textAlign: 'center'
  }),

  topSide: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around"
  },

  icon: (darkMode) => ({
    marginTop: 7,
    height: 45,
    aspectRatio: 1,
    tintColor: darkMode ? colors.white : colors.dark,
  })

});