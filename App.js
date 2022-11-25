import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Switch} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as SplashScreen from 'expo-splash-screen';
import Dashboard from './components/dashboard';
import options from './options.json';
import colors from './colors';
import DifficultySelector from './components/difficultySelector';
import Table from './components/table';


SplashScreen.preventAutoHideAsync()


export default function App() {

  const [isPlay, setIsPlay] = useState(true)
  const [isFirst, setIsFirst] = useState(true)
  const [difficulty, setDifficulty] = useState(0)
  const [numOfFlags, setNumOfFlag] = useState(0)
  const [numOfActiveMines, setNumOfActiveMines] = useState(options[difficulty].numberOfMine)
  const [isDarkMode, setIsDarkMode] = useState(false)
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
    setIsDarkMode(isDarkSelected)
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
          setDifficulty(JSON.parse(dif))
        }
        const darkMdoe = await AsyncStorage.getItem('DarkMode')
        if(darkMdoe !== null) {
          setIsDarkMode(JSON.parse(darkMdoe))
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
      
      <DifficultySelector difficulty={difficulty} setDifficulty={setDifficulty} isDarkMode={isDarkMode} />

      <Dashboard difficulty={difficulty} numOfFlags={numOfFlags} numOfActiveMines={numOfActiveMines} />

      <Table table={table} setTable={setTable} difficulty={difficulty} isFirst={isFirst} setIsFirst={setIsFirst} 
        isPlay={isPlay} setIsPlay={setIsPlay} setNumOfFlag={setNumOfFlag} setNumOfActiveMines={setNumOfActiveMines} />

      <View style={styles.footer}>

        <TouchableOpacity style={styles.btnReset} onPress={onReset}>
          <Text style={{fontSize:24}}>Reset</Text>
        </TouchableOpacity>

        <View style={styles.themeContainer}>

          <Image source={require("./assets/sun.png")} style={styles.sunIcon} />

          <Switch
            thumbColor = {isDarkMode ? colors.red : colors.white}
            trackColor = {{true: colors.darkRed}}
            onValueChange={() => changeTheme(!isDarkMode)}
            value={isDarkMode}
          />

          <Image source={require("./assets/moon.png")} style={styles.moonIcon} />

        </View>

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