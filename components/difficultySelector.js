import { View, TouchableOpacity, Text, StyleSheet } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../colors';

export default function DifficultySelector({ difficulty, setDifficulty, isDarkMode }) {


    function changeDifficulty( selected ){
        setDifficulty(selected)
        try {
          AsyncStorage.setItem('Difficulty', JSON.stringify(selected))
        } catch (e) {
          console.error("error on save Difficulty")
        }
    }

    return (
        <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: "100%" }}>
            <TouchableOpacity style={{ ...styles.btnReset, backgroundColor: difficulty === 0 ? colors.redFlag : isDarkMode ? colors.white : colors.dark }} onPress={() => changeDifficulty(0)}>
                <Text style={{ color: difficulty === 0 || isDarkMode ? colors.dark : colors.white }} >Easy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ ...styles.btnReset, backgroundColor: difficulty === 1 ? colors.redFlag : isDarkMode ? colors.white : colors.dark }} onPress={() => changeDifficulty(1)}>
                <Text style={{ color: difficulty === 1 || isDarkMode ? colors.dark : colors.white }} >Medium</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ ...styles.btnReset, backgroundColor: difficulty === 2 ? colors.redFlag : isDarkMode ? colors.white : colors.dark }} onPress={() => changeDifficulty(2)}>
                <Text style={{ color: difficulty === 2 || isDarkMode ? colors.dark : colors.white }} >Hard</Text>
            </TouchableOpacity>
        </View>
    )

}

const styles = StyleSheet.create({ 
    btnReset: {
      justifyContent: "center",
      backgroundColor: "lightgrey",
      borderRadius:6,
      paddingHorizontal: 18,
      paddingVertical: 4
    }
});