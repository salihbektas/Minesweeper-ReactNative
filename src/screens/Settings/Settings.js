import { useCallback, useEffect, useState } from "react";
import { Button, Image, Pressable, StyleSheet, Text, View } from "react-native";
import colors from "../../../colors";
import { useAtom } from "jotai";
import { store } from "../../store";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";



export default function Settings({ navigation }) {

  const [data, setData] = useAtom(store)

  const darkMode = data.darkMode

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

    AsyncStorage.setItem('DarkMode', JSON.stringify(isDarkMode())).catch(err => {console.error("error on save DarkMode", err)})
    setData(d => ({...d, darkMode: isDarkMode()}))
  }

  function changeDifficulty(selectedDifficulty) {
    let newDifficulty = selectedDifficulty()
    AsyncStorage.setItem('Difficulty', JSON.stringify(newDifficulty)).catch(err => {console.error("error on save Difficulty", err)})
    setData((data) => ({...data, difficulty: newDifficulty}))
  }

  return (
    <View style={styles.container(darkMode)} >
      <View style={styles.dashboard} >
        <Pressable onPress={() => navigation.goBack()} >
          <Image source={require("../../../assets/arrow.png")} style={styles.back(darkMode)} />
        </Pressable>
        <Text style={styles.settingText(darkMode)}>Settings</Text>
      </View>

      <View style={styles.main} >

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

        <Text style={styles.feedbackText(darkMode)}>{`Selected difficulty:\n${data.difficulty === 0 ? 'easy' : data.difficulty === 1 ? 'medium' : 'hard'}`}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: (isDarkMode) => ({
    flex: 1,
    backgroundColor: isDarkMode ? colors.dark : colors.light,
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

  main: {
    flex: 1,
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center"
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