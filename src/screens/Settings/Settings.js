import { useCallback, useEffect, useState } from "react";
import { Button, Image, Pressable, StyleSheet, Text, View } from "react-native";
import colors from "../../../colors";
import { useAtom } from "jotai";
import { store } from "../../store";



export default function Settings({ navigation }) {

  const [data, setData] = useAtom(store)

  return (
    <View style={styles.container(data.darkMode)} >
      <View style={styles.dashboard} >
        <Pressable onPress={() => navigation.goBack()} >
          <Image source={require("../../../assets/arrow.png")} style={styles.back(data.darkMode)} />
        </Pressable>
        <Text style={styles.settingText(data.darkMode)}>Settings</Text>
      </View>

      <View style={styles.main} >
        <Button onPress={() => setData((data) => ({...data, darkMode: !data.darkMode}))} title="change theme"/>
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
    justifyContent: "center",
    alignItems: "center"
  }

})