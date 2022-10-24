import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';


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
          numberOfAdjacentMines: 0
        }
        field[i][j] = cell
      }
    }

    return field
  }


  const [table, setTable] = useState(() => generateTable())



  return (
    <View style={styles.container}>
      {table.map((row, rowIndex) => 
        row.map((cell, cellIndex) => {
          return (<View style={{alignItems: "center", justifyContent: "center", borderWidth:2, width:width/4, aspectRatio:1}} key={`${rowIndex}${cellIndex}`}>
            <Text>{cell.numberOfAdjacentMines}</Text>
          </View>)
        }))}
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