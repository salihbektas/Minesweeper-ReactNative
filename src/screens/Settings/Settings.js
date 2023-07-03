import { useCallback, useEffect, useState } from "react";
import { Button, Image, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import colors from "../../../colors";
import { useAtom } from "jotai";
import { store } from "../../store";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatTime } from "../../utils";


const tabs = ['Settings', 'Records']

export default function Settings({ navigation }) {

  const [selectedTab, setSelectedTab] = useState(0)

  const [data, setData] = useAtom(store)

  const darkMode = data.darkMode
  const vibration = data.vibration

  const [openTheme, setOpenTheme] = useState(false)
  const [themes, setThemes] = useState([{ label: 'DARK', value: true }, { label: 'LIGHT', value: false }])

  const [openDifficulties, setOpenDifficulties] = useState(false);
  const [difficulties, setDifficulties] = useState([{ label: 'Easy', value: 0 }, { label: 'Medium', value: 1 }, { label: 'Hard', value: 2 }])

  const onThemeOpen = useCallback(() => {
    setOpenDifficulties(false)
  }, [])

  const onColorCodeOpen = useCallback(() => {
    setOpenTheme(false)
  }, [])


  function changeTheme(isDarkMode) {

    AsyncStorage.setItem('DarkMode', JSON.stringify(isDarkMode())).catch(err => { console.error("error on save DarkMode", err) })
    setData(d => ({ ...d, darkMode: isDarkMode() }))
  }

  function changeDifficulty(selectedDifficulty) {
    let newDifficulty = selectedDifficulty()
    AsyncStorage.setItem('Difficulty', JSON.stringify(newDifficulty)).catch(err => { console.error("error on save Difficulty", err) })
    setData((data) => ({ ...data, difficulty: newDifficulty }))
  }

  function changeVibration() {
    AsyncStorage.setItem('Vibration', JSON.stringify(!vibration)).catch(err => { console.error("error on save Vibration", err) })
    setData((data) => ({ ...data, vibration: !vibration }))
  }

  return (
    <View style={styles.container(darkMode)} >
      <View style={styles.dashboard} >
        <Pressable onPress={() => navigation.goBack()} >
          <Image source={require("../../../assets/arrow.png")} style={styles.back(darkMode)} />
        </Pressable>

        {tabs.map((item, index) => {
          const isActive = index === selectedTab;

          return (
            <View style={{ flex: 1 }} key={index}>
              <Pressable
                onPress={() => {
                  setSelectedTab(index);
                }}>
                <View
                  style={[
                    styles.item(darkMode),
                    isActive && { borderBottomColor: colors.tileOpened },
                  ]}>
                  <Text style={[styles.settingText(darkMode), isActive && { color: colors.tileOpened }]}>
                    {item}
                  </Text>
                </View>
              </Pressable>
            </View>
          )
        })}
      </View>

      <View style={styles.main} >

        {selectedTab === 0
          ?
          <>
            <View style={styles.row}>
              <Text style={styles.text(darkMode)}>{'Theme:'}</Text>
              <DropDownPicker
                open={openTheme}
                value={darkMode}
                items={themes}
                setOpen={setOpenTheme}
                setValue={changeTheme}
                onOpen={onThemeOpen}
                theme={darkMode ? 'LIGHT' : 'DARK'}
                containerStyle={styles.dropDownPicker}
                style={styles.dropDownPickerStyle(darkMode)}
                dropDownContainerStyle={styles.dropDownPickerStyle(darkMode)}
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.text(darkMode)}>{'Difficulty:'}</Text>
              <DropDownPicker
                open={openDifficulties}
                value={data.difficulty}
                items={difficulties}
                setOpen={setOpenDifficulties}
                setValue={changeDifficulty}
                onOpen={onColorCodeOpen}
                theme={darkMode ? 'LIGHT' : 'DARK'}
                containerStyle={styles.dropDownPicker}
                style={styles.dropDownPickerStyle(darkMode)}
                dropDownContainerStyle={styles.dropDownPickerStyle(darkMode)}
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.text(darkMode)}>{'Vibration:'}</Text>
              <Switch
                thumbColor = {colors.tileOpened}
                trackColor = {{true: colors.tileOpened, false: darkMode ? colors.white : colors.dark}}
                onValueChange={changeVibration}
                value={vibration}
              />
            </View>
          </>
          :
          <>
            <Text style={styles.feedbackText(darkMode)}>{`Easy: ${data.records.e ? formatTime(data.records.e) : 'not set'}`}</Text>
            <Text style={styles.feedbackText(darkMode)}>{`Medium: ${data.records.m ? formatTime(data.records.m) : 'not set'}`}</Text>
            <Text style={styles.feedbackText(darkMode)}>{`hard: ${data.records.h ? formatTime(data.records.h) : 'not set'}`}</Text>
          </>
        }


      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: (isDarkMode) => ({
    flex: 1,
    backgroundColor: isDarkMode ? colors.dark : colors.white,
    alignItems: 'center',
    paddingHorizontal: 16
  }),

  dashboard: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30
  },

  back: (darkMode) => ({
    height: 30,
    width: 30,
    tintColor: darkMode ? colors.white : colors.dark,
  }),

  settingText: (darkMode) => ({
    color: darkMode ? colors.white : colors.dark,
    fontSize: 32,
    fontWeight: "700"
  }),

  item: (darkMode) => ({
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderColor: darkMode ? colors.dark : colors.white,
    borderBottomWidth: 2,
  }),

  main: {
    flex: 1,
    width: "100%",
    justifyContent: "space-evenly"
  },

  feedbackText: (darkMode) => ({
    color: darkMode ? colors.white : colors.dark,
    fontSize: 24,
    fontWeight: "600"
  }),

  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  text: (darkMode) => ({
    color: darkMode ? colors.white : colors.dark,
    fontSize: 28
  }),

  dropDownPicker: { width: "40%" },

  dropDownPickerStyle: (darkMode) => ({
    backgroundColor: darkMode ? colors.white : colors.dark
  })

})