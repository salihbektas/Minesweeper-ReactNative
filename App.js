import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, View, Image, Vibration} from 'react-native';


const width = Dimensions.get("window").width

export default function App() {

  const LENGTH_OF_TABLE_EDGE = 10
  const modifierList = [
    [-1,-1],
    [-1, 0],
    [-1, 1],
    [ 0,-1],
    [ 0, 1],
    [ 1,-1],
    [ 1, 0],
    [ 1, 1]
  ]

  const [isPlay, setIsPlay] = useState(true)
  const [isFirst, setIsFirst] = useState(true)

  function generateTable(){
    setIsPlay(true)
    setIsFirst(true)

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
          isFlagged: false,
        }
        field[i][j] = cell
      }
    }

    return field
  }

  function createMines(firstTouchRow, firstTouchColumn){

    let numberOfMine = 0

    while(numberOfMine < 20){
      let x = Math.floor(Math.random() * LENGTH_OF_TABLE_EDGE)
      let y = Math.floor(Math.random() * LENGTH_OF_TABLE_EDGE)

      if(!table[x][y].isMine &&
          (x < firstTouchRow-1 || x > firstTouchRow+1 ||
           y < firstTouchColumn-1 || y > firstTouchColumn+1)
        )
      {
        for(let i = x-1; i < x+2; ++i){
          for(let j = y-1; j < y+2; ++j){
            if(i >= 0 && i < LENGTH_OF_TABLE_EDGE && j >= 0 && j < LENGTH_OF_TABLE_EDGE){
              table[i][j].numberOfAdjacentMines += 1
            }
          }
        }
        table[x][y].isMine = true
        ++numberOfMine
      }
    }

  }


  const [table, setTable] = useState([[]])

  function onPress(row, column){
    if(isFirst){
      createMines(row, column)
      setIsFirst(false)
    }
    
    if(table[row][column].isFlagged ||
       table[row][column].isPressed ||
       !isPlay)
      return

    let newTable = [...table]
    newTable[row][column].isPressed = true
    if(newTable[row][column].isMine)
      setIsPlay(false)

    if(newTable[row][column].numberOfAdjacentMines === 0){
      let neighbourTileStack = []

      neighbourTileStack.push([row, column])

      while(neighbourTileStack.length > 0){
        const [rowIndex, columnIndex] = neighbourTileStack.pop()

        modifierList.map(([rowModifier, columnModifier]) => {
          if(rowIndex+rowModifier >= 0 && 
             rowIndex+rowModifier < LENGTH_OF_TABLE_EDGE && 
             columnIndex+columnModifier >= 0 &&
             columnIndex+columnModifier < LENGTH_OF_TABLE_EDGE &&
             !newTable[rowIndex+rowModifier][columnIndex+columnModifier].isPressed)
          {
            newTable[rowIndex+rowModifier][columnIndex+columnModifier].isPressed = true
            if(newTable[rowIndex+rowModifier][columnIndex+columnModifier].isMine)
              setIsPlay(false)
            if(newTable[rowIndex+rowModifier][columnIndex+columnModifier].numberOfAdjacentMines === 0)
              neighbourTileStack.push([rowIndex+rowModifier, columnIndex+columnModifier])
          }
        })
      }
    }

    setTable(newTable)
  }

  function onFlag(row, column){
    if(table[row][column].isPressed)
      return
    
    let newTable = [...table]

    newTable[row][column].isFlagged = !newTable[row][column].isFlagged 

    setTable(newTable)
    Vibration.vibrate(100)
  }

  function openAllNeighbour(row, column){

    [-1, 0, 1].forEach(rowModifier => {
      [-1, 0, 1].forEach(columnModifier => {
        if(row+rowModifier >= 0 && row+rowModifier < LENGTH_OF_TABLE_EDGE && column+columnModifier >= 0 && column+columnModifier < LENGTH_OF_TABLE_EDGE)
          onPress(row+rowModifier, column+columnModifier)
      })
    })
  }

  function onLongPress(row, column){
    if(!isPlay)
      return
    if(table[row][column].isPressed)
      openAllNeighbour(row, column)
    else
      onFlag(row, column)

  }

  useEffect(() => {
    setTable(generateTable())
  },[])


  return (
    <View style={styles.container}>
      <View style={styles.table}>
        {table.map((row, rowIndex) =>
          <View style={styles.row} key={rowIndex} >
            {row.map((cell, cellIndex) => {
              return (
                <Pressable style={{alignItems: "center", justifyContent: "center", width:width/LENGTH_OF_TABLE_EDGE-1, aspectRatio:1, backgroundColor: cell.isPressed ? tileOpened : tileClosed}} key={`${rowIndex}${cellIndex}`} onPress={() => onPress(rowIndex, cellIndex)} onLongPress={() => onLongPress(rowIndex, cellIndex)} >
                  {cell.isFlagged ? <Image source={require("./assets/redFlag.png")} style={{width:width/LENGTH_OF_TABLE_EDGE-1, height:width/LENGTH_OF_TABLE_EDGE-1, resizeMode: "contain"}} /> : 
                  cell.isPressed ? cell.isMine ? <Image source={require("./assets/mine.png")} style={{width:width/LENGTH_OF_TABLE_EDGE-5, height:width/LENGTH_OF_TABLE_EDGE-5, resizeMode: "contain"}} /> :
                  <Text>{cell.numberOfAdjacentMines}</Text> : null}
                </Pressable>
              )
            })}
          </View>
        )}
      </View>
      <TouchableOpacity style={styles.btnReset} onPress={() => setTable(generateTable())}>
        <Text>Reset</Text>
      </TouchableOpacity>
    </View>
  );
}

const dark = '#13141F'
const white = '#FCFCFC'
const tileClosed = '#30B7FF'
const tileOpened = '#6A7BFF'
const redFlag = '#F07067'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 25
  },

  table: {
    backgroundColor: dark,
    width: "100%",
    aspectRatio: 1,
    justifyContent: "space-evenly",
  },

  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  btnReset: {
    backgroundColor: "lightgrey",
    borderRadius:6,
    paddingHorizontal: 18,
    paddingVertical: 6
  }
});