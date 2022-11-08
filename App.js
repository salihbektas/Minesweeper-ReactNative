import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, View, Image, Vibration} from 'react-native';


const width = Dimensions.get("window").width

const options = [
                  {tableLength:6, numberOfMine:5},
                  {tableLength:10, numberOfMine:16},
                  {tableLength:12, numberOfMine:28}
                ]
export default function App() {

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
  const [difficulty, setDifficulty] = useState(0)
  const [numOfFlags, setNumOfFlag] = useState(0)
  const [numOfActiveMines, setNumOfActiveMines] = useState(options[difficulty].numberOfMine)


  function generateTable(){
    setIsPlay(true)
    setIsFirst(true)

    const field = new Array(options[difficulty].tableLength)

    for(let i = 0; i < options[difficulty].tableLength; ++i)
      field[i] = new Array(options[difficulty].tableLength)

    for(let i = 0; i < options[difficulty].tableLength; ++i){
      for(let j = 0; j < options[difficulty].tableLength; ++j){
        field[i][j] = {
          isMine: false,
          row: i,
          column: j,
          numberOfAdjacentMines: 0,
          isPressed: false,
          isFlagged: false,
        }
      }
    }

    return field
  }

  function createMines(firstTouchRow, firstTouchColumn){

    let numberOfMine = 0

    while(numberOfMine < options[difficulty].numberOfMine){
      let x = Math.floor(Math.random() * options[difficulty].tableLength)
      let y = Math.floor(Math.random() * options[difficulty].tableLength)

      if(!table[x][y].isMine &&
          (x < firstTouchRow-1 || x > firstTouchRow+1 ||
           y < firstTouchColumn-1 || y > firstTouchColumn+1)
        )
      {
        for(let i = x-1; i < x+2; ++i){
          for(let j = y-1; j < y+2; ++j){
            if(i >= 0 && i < options[difficulty].tableLength && j >= 0 && j < options[difficulty].tableLength){
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
             rowIndex+rowModifier < options[difficulty].tableLength && 
             columnIndex+columnModifier >= 0 &&
             columnIndex+columnModifier < options[difficulty].tableLength &&
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
    if(newTable[row][column].isFlagged){
      setNumOfFlag(prev => prev-1)
      setNumOfActiveMines(prev => prev+1)
    }
    else{
      setNumOfFlag(prev => prev+1)
      setNumOfActiveMines(prev => prev-1)
    }

    newTable[row][column].isFlagged = !newTable[row][column].isFlagged 

    setTable(newTable)
    Vibration.vibrate(100)
  }

  function openAllNeighbour(row, column){

    [-1, 0, 1].forEach(rowModifier => {
      [-1, 0, 1].forEach(columnModifier => {
        if(row+rowModifier >= 0 && row+rowModifier < options[difficulty].tableLength && column+columnModifier >= 0 && column+columnModifier < options[difficulty].tableLength)
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

  function onReset(){
    setTable(generateTable())
    setNumOfActiveMines(options[difficulty].numberOfMine)
    setNumOfFlag(0)
  }

  useEffect(() => {
    setTable(generateTable())
  },[])

  useEffect(()=>{
    setTable(generateTable())
    setNumOfActiveMines(options[difficulty].numberOfMine)
    setNumOfFlag(0)
  },[difficulty])


  return (
    <View style={styles.container}>
      <View style={{flexDirection:"row", justifyContent:"space-evenly", width:"100%"}}>
        <TouchableOpacity style={{...styles.btnReset, backgroundColor: difficulty===0 ? redFlag : dark}} onPress={() => setDifficulty(0)}>
          <Text style={{color:difficulty===0 ? dark : white}} >Easy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{...styles.btnReset, backgroundColor: difficulty===1 ? redFlag : dark}} onPress={() => setDifficulty(1)}>
          <Text style={{color:difficulty===1 ? dark : white}} >Medium</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{...styles.btnReset, backgroundColor: difficulty===2 ? redFlag : dark}} onPress={() => setDifficulty(2)}>
          <Text style={{color:difficulty===2 ? dark : white}} >Hard</Text>
        </TouchableOpacity>
      </View>

      <View style={{flexDirection:"row", justifyContent:"space-evenly", width:"100%"}}>
        <Text style={{fontSize:24}} >{options[difficulty].numberOfMine}</Text>
        <Image source={require("./assets/mine.png")} style={{width:30, aspectRatio:1, resizeMode: "contain"}} />
        <Text style={{fontSize:24}} >-</Text>

        <Text style={{fontSize:24}} >{numOfFlags}</Text>
        <Image source={require("./assets/redFlag.png")} style={{width:30, aspectRatio:1, resizeMode: "contain"}} />

        <Text style={{fontSize:24}} >=</Text>

        <Text style={{fontSize:24}} >{numOfActiveMines}</Text>

      </View>
      <View style={styles.table}>
        {table.map((row, rowIndex) =>
          <View style={styles.row} key={rowIndex} >
            {row.map((cell, cellIndex) => {
              return (
                <Pressable style={{alignItems: "center", justifyContent: "center", width:width/options[difficulty].tableLength-1, aspectRatio:1, backgroundColor: cell.isPressed ? tileOpened : tileClosed}} key={`${rowIndex}${cellIndex}`} onPress={() => onPress(rowIndex, cellIndex)} onLongPress={() => onLongPress(rowIndex, cellIndex)} >
                  {cell.isFlagged ? <Image source={require("./assets/redFlag.png")} style={{width:width/options[difficulty].tableLength-1, height:width/options[difficulty].tableLength-1, resizeMode: "contain"}} /> : 
                  cell.isPressed ? cell.isMine ? <Image source={require("./assets/mine.png")} style={{width:width/options[difficulty].tableLength-5, height:width/options[difficulty].tableLength-5, resizeMode: "contain"}} /> :
                  <Text>{cell.numberOfAdjacentMines}</Text> : null}
                </Pressable>
              )
            })}
          </View>
        )}
      </View>
      <TouchableOpacity style={styles.btnReset} onPress={onReset}>
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