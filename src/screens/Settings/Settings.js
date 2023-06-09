import { useCallback, useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import colors from "../../../colors";



export default function Settings({ navigation }) {

    const darkMode = true

  return (
    <View style={styles.container(darkMode)} >
      <View style={styles.dashboard} >
        <Pressable onPress={() => navigation.goBack()} >
          <Image source={require("../../../assets/arrow.png")} style={styles.back(darkMode)} />
        </Pressable>
        <Text style={styles.settingText(darkMode)}>Settings</Text>
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

})