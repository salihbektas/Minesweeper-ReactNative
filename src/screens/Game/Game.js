import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Switch, Pressable} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as SplashScreen from 'expo-splash-screen';
import Dashboard from '../../components/dashboard';
import options from '../../../options.json';
import colors from '../../../colors';
import Table from '../../components/table';
import { useAtomValue } from 'jotai';
import { store } from '../../store';


SplashScreen.preventAutoHideAsync()


export default function Game({ navigation }) {

  const [isPlay, setIsPlay] = useState(true)
  const [isFirst, setIsFirst] = useState(true)
  const difficulty = useAtomValue(store).difficulty
  const [numOfFlags, setNumOfFlag] = useState(0)
  const [numOfActiveMines, setNumOfActiveMines] = useState(options[difficulty].numberOfMine)
  const isDarkMode = useAtomValue(store).darkMode
  const [appIsReady, setAppIsReady] = useState(false)
  const [table, setTable] = useState([[]])

  function generateTable(){
    setIsPlay(true)
    setIsFirst(true)

    const field = new Array(options[difficulty].tableLength)

    for(let i = 0; i < options[difficulty].tableLength; ++i)
      field[i] = new Array(options[difficulty].tableLength)

    for(let i = 0; i < options[difficulty].tableLength; ++i){
      for(let j = 0; j < options[difficulty].tableLength; ++j){
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

  function onReset(){
    setTable(generateTable())
    setNumOfActiveMines(options[difficulty].numberOfMine)
    setNumOfFlag(0)
  }

  function changeTheme( isDarkSelected ){
    try {
      AsyncStorage.setItem('DarkMode', JSON.stringify(isDarkSelected))
    } catch (e) {
      console.error("error on save DarkMode")
    }
  }

  useEffect(() => {
    async function prepare() {
      try {
        const dif = await AsyncStorage.getItem('Difficulty')
        if(dif !== null) {
          //setDifficulty(JSON.parse(dif))
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
    setTable(generateTable())
  }, []);

  useEffect(()=>{
    setTable(generateTable())
    setNumOfActiveMines(options[difficulty].numberOfMine)
    setNumOfFlag(0)
  },[difficulty])

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{...styles.container, backgroundColor: isDarkMode ? colors.dark : colors.white}}
      onLayout={onLayoutRootView} >

      <StatusBar style={isDarkMode ? 'light' : 'dark'}/>
    

      <Dashboard difficulty={difficulty} numOfFlags={numOfFlags} numOfActiveMines={numOfActiveMines} />

      <Table table={table} setTable={setTable} difficulty={difficulty} isFirst={isFirst} setIsFirst={setIsFirst} 
        isPlay={isPlay} setIsPlay={setIsPlay} setNumOfFlag={setNumOfFlag} setNumOfActiveMines={setNumOfActiveMines} />

      <View style={styles.footer}>

        <TouchableOpacity style={styles.btnReset} onPress={onReset}>
          <Text style={{fontSize:24}}>Reset</Text>
        </TouchableOpacity>

        <Pressable onPress={() => navigation.navigate('Settings')} >
          <Image source={require("../../../assets/setting.png")} style={styles.settings(isDarkMode)} />
        </Pressable>

      </View>
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

  btnReset: {
    justifyContent: "center",
    backgroundColor: "lightgrey",
    borderRadius:6,
    paddingHorizontal: 18,
    paddingVertical: 4
  },

  themeContainer: {
    flexDirection: "row",
    backgroundColor: "lightgrey",
    alignItems: "center",
    borderRadius: 6,
  },

  footer: {
    flexDirection:"row", 
    width:"100%", 
    justifyContent:"space-around"
  },

  settings: (darkMode) => ({
    height: 45,
    aspectRatio: 1,
    tintColor: darkMode ? colors.white : colors.dark,
  }),

  sunIcon: {
    width:30, 
    aspectRatio:1, 
    resizeMode: "contain", 
    marginRight: 10, 
    marginLeft: 5
  },

  moonIcon: {
    width:40, 
    aspectRatio:1, 
    resizeMode: "contain"
  }

});