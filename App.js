import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';


const width = Dimensions.get("window").width

export default function App() {

  function generateTable(){
    const field = new Array(4)

    for(let i = 0; i < 4; ++i)
      field[i] = new Array(4)

    for(let i = 0; i < 4; ++i){
      for(let j = 0; j < 4; ++j){
        let cell = {
          isMine: false,
          row: i,
          column: j,
          numberOfAdjacentMines: 0,
          isPressed: false
        }
        field[i][j] = cell
      }
    }

    return field
  }


  const [table, setTable] = useState(() => generateTable())
  const [counter, setCounter] = useState(0)

  function onPress(row, column){
    let newTable = [...table]
    newTable[row][column].isPressed = true

    setTable(newTable)

  }



  return (
    <View style={styles.container}>
      {table.map((row, rowIndex) =>
        row.map((cell, cellIndex) => {
          return (<Pressable style={{alignItems: "center", justifyContent: "center", borderWidth:2, width:width/4, aspectRatio:1}} key={`${rowIndex}${cellIndex}`} onPress={() => onPress(rowIndex, cellIndex)}>
            {cell.isPressed ? <Text>{cell.numberOfAdjacentMines}</Text> : null}
          </Pressable>)
        }
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    flexDirection:"row",
    paddingTop: 25
  },
});