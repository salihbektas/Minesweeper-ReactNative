import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const width = Dimensions.get("window").width

export default function App() {

  const LENGTH_OF_TABLE_EDGE = 10

  function generateTable(){

    const field = new Array(LENGTH_OF_TABLE_EDGE)

    for(let i = 0; i < LENGTH_OF_TABLE_EDGE; ++i)
      field[i] = new Array(LENGTH_OF_TABLE_EDGE)

    for(let i = 0; i < LENGTH_OF_TABLE_EDGE; ++i){
      for(let j = 0; j < LENGTH_OF_TABLE_EDGE; ++j){
        let cell = {
          isMine: false,
          row: i,
          column: j,
          numberOfAdjacentMines: 0,
          isPressed: false,
          isFlagged: false
        }
        field[i][j] = cell
      }
    }

    let numberOfMine = 0

    while(numberOfMine < 4){
      let x = Math.floor(Math.random() * LENGTH_OF_TABLE_EDGE)
      let y = Math.floor(Math.random() * LENGTH_OF_TABLE_EDGE)

      if(!field[x][y].isMine){
        for(let i = x-1; i < x+2; ++i){
          for(let j = y-1; j < y+2; ++j){
            if(i >= 0 && i < LENGTH_OF_TABLE_EDGE && j >= 0 && j < LENGTH_OF_TABLE_EDGE){
              field[i][j].numberOfAdjacentMines += 1
            }
          }
        }
        field[x][y].isMine = true
        ++numberOfMine
      }
    }  

    return field
  }


  const [table, setTable] = useState([[]])

  function onPress(row, column){
    if(table[row][column].isFlagged ||
       table[row][column].isPressed)
      return

    let newTable = [...table]
    newTable[row][column].isPressed = true

    let neighboringTiles = []

    if(newTable[row][column].numberOfAdjacentMines === 0){
      for(let i = row-1; i < row+2; ++i){
        for(let j = column-1; j < column+2; ++j){
          if(i >= 0 && i < LENGTH_OF_TABLE_EDGE && j >= 0 && j < LENGTH_OF_TABLE_EDGE){
            neighboringTiles.push([i,j])
          }
        }
      }

      neighboringTiles.map(item => onPress(item[0], item[1]))
      
    }

    setTable(newTable)

  }

  function onFlag(row, column){
    if(table[row][column].isPressed)
      return
    
    let newTable = [...table]

    newTable[row][column].isFlagged = !newTable[row][column].isFlagged 

    setTable(newTable)
  }

  useEffect(() => {
    setTable(generateTable())
  },[])


  return (
    <View style={styles.container}>
      <View style={styles.table}>
        {table.map((row, rowIndex) =>
          row.map((cell, cellIndex) => {
            return (<Pressable style={{alignItems: "center", justifyContent: "center", borderWidth:2, width:width/LENGTH_OF_TABLE_EDGE, aspectRatio:1}} key={`${rowIndex}${cellIndex}`} onPress={() => onPress(rowIndex, cellIndex)} onLongPress={() => onFlag(rowIndex, cellIndex)} >
              {cell.isFlagged ? <Text>F</Text> : cell.isPressed ? cell.isMine ? <Text>#</Text>:<Text>{cell.numberOfAdjacentMines}</Text> : null}
            </Pressable>)
          }
        ))}
      </View>
      <TouchableOpacity style={styles.btnReset} onPress={() => setTable(generateTable())}>
        <Text>Reset</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 25
  },

  table: {

    flexWrap: 'wrap',
    flexDirection:"row",
    justifyContent: "center",
    alignItems:"center"
  },

  btnReset: {
    backgroundColor: "lightgrey",
    borderRadius:6,
    paddingHorizontal: 18,
    paddingVertical: 6
  }
});