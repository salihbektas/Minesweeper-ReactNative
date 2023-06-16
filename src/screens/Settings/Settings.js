import { useCallback, useEffect, useState } from "react";
import { Button, Image, Pressable, StyleSheet, Text, View } from "react-native";
import colors from "../../../colors";
import { useAtom } from "jotai";
import { store } from "../../store";
import DropDownPicker from "react-native-dropdown-picker";



export default function Settings({ navigation }) {

  const [data, setData] = useAtom(store)

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



  function changeDifficulty() {
    let newDifficulty = data.difficulty + 1
    if (newDifficulty > 2) newDifficulty = 0

    setData((data) => ({...data, difficulty: newDifficulty}))
  }

  return (
    <View style={styles.container(data.darkMode)} >
      <View style={styles.dashboard} >
        <Pressable onPress={() => navigation.goBack()} >
          <Image source={require("../../../assets/arrow.png")} style={styles.back(data.darkMode)} />
        </Pressable>
        <Text style={styles.settingText(data.darkMode)}>Settings</Text>
      </View>

      <View style={styles.main} >

        <View style={styles.row}>
          <Text style={styles.text(data.darkMode)}>{'Theme:'}</Text>
          <DropDownPicker
            open={openTheme}
            value={data.darkMode}
            items={themes}
            setOpen={setOpenTheme}
            setValue={(newTheme) => setData((data) => ({...data, darkMode: newTheme()}))}
            onOpen={onThemeOpen}
            theme={data.darkMode ? 'LIGHT' : 'DARK'}
            containerStyle={styles.dropDownPicker}
            style={styles.dropDownPickerStyle(data.darkMode)}
            dropDownContainerStyle={styles.dropDownPickerStyle(data.darkMode)}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.text(data.darkMode)}>{'Difficulty:'}</Text>
          <DropDownPicker
            open={openDifficulties}
            value={data.difficulty}
            items={difficulties}
            setOpen={setOpenDifficulties}
            setValue={(newDifficulty) => setData((data) => ({...data, difficulty: newDifficulty()}))}
            onOpen={onColorCodeOpen}
            theme={data.darkMode ? 'LIGHT' : 'DARK'}
            containerStyle={styles.dropDownPicker}
            style={styles.dropDownPickerStyle(data.darkMode)}
            dropDownContainerStyle={styles.dropDownPickerStyle(data.darkMode)}
          />
        </View>

        <Text style={styles.feedbackText(data.darkMode)}>{`Selected difficulty:\n${data.difficulty === 0 ? 'easy' : data.difficulty === 1 ? 'medium' : 'hard'}`}</Text>
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