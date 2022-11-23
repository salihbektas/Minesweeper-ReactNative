import { View, Text, Dimensions, Pressable, StyleSheet, Image, Vibration } from "react-native";

import options from '../options.json';
import colors from '../colors';

const width = Dimensions.get("window").width

export default function Table({ table, setTable, difficulty, isFirst, setIsFirst, isPlay, setIsPlay, setNumOfFlag, setNumOfActiveMines }) {


    const modifierList = [
        [-1, -1],
        [-1,  0],
        [-1,  1],
        [ 0,  1],
        [ 0, -1],
        [ 1, -1],
        [ 1,  0],
        [ 1,  1]
    ]


    function onPress(row, column) {
        if (isFirst) {
            createMines(row, column)
            setIsFirst(false)
        }

        if (table[row][column].isFlagged ||
            table[row][column].isPressed ||
            !isPlay)
            return

        let newTable = [...table]
        newTable[row][column].isPressed = true
        if (newTable[row][column].isMine)
            setIsPlay(false)

        if (newTable[row][column].numberOfAdjacentMines === 0) {
            let neighbourTileStack = []

            neighbourTileStack.push([row, column])

            while (neighbourTileStack.length > 0) {
                const [rowIndex, columnIndex] = neighbourTileStack.pop()

                modifierList.map(([rowModifier, columnModifier]) => {
                    if (rowIndex + rowModifier >= 0 &&
                        rowIndex + rowModifier < options[difficulty].tableLength &&
                        columnIndex + columnModifier >= 0 &&
                        columnIndex + columnModifier < options[difficulty].tableLength &&
                        !newTable[rowIndex + rowModifier][columnIndex + columnModifier].isPressed &&
                        !newTable[rowIndex + rowModifier][columnIndex + columnModifier].isFlagged) {
                        newTable[rowIndex + rowModifier][columnIndex + columnModifier].isPressed = true
                        if (newTable[rowIndex + rowModifier][columnIndex + columnModifier].isMine)
                            setIsPlay(false)
                        if (newTable[rowIndex + rowModifier][columnIndex + columnModifier].numberOfAdjacentMines === 0)
                            neighbourTileStack.push([rowIndex + rowModifier, columnIndex + columnModifier])
                    }
                })
            }
        }

        setTable(newTable)
    }

    function onFlag(row, column) {
        if (table[row][column].isPressed)
            return

        let newTable = [...table]
        if (newTable[row][column].isFlagged) {
            setNumOfFlag(prev => prev - 1)
            setNumOfActiveMines(prev => prev + 1)
        }
        else {
            setNumOfFlag(prev => prev + 1)
            setNumOfActiveMines(prev => prev - 1)
        }

        newTable[row][column].isFlagged = !newTable[row][column].isFlagged

        setTable(newTable)
        Vibration.vibrate(100)
    }

    function openAllNeighbour(row, column) {

        [-1, 0, 1].forEach(rowModifier => {
            [-1, 0, 1].forEach(columnModifier => {
                if (row + rowModifier >= 0 && row + rowModifier < options[difficulty].tableLength && column + columnModifier >= 0 && column + columnModifier < options[difficulty].tableLength)
                    onPress(row + rowModifier, column + columnModifier)
            })
        })
    }

    function onLongPress(row, column) {
        if (!isPlay)
            return
        if (table[row][column].isPressed)
            openAllNeighbour(row, column)
        else
            onFlag(row, column)

    }

    function createMines(firstTouchRow, firstTouchColumn) {

        let numberOfMine = 0

        while (numberOfMine < options[difficulty].numberOfMine) {
            let x = Math.floor(Math.random() * options[difficulty].tableLength)
            let y = Math.floor(Math.random() * options[difficulty].tableLength)

            if (!table[x][y].isMine &&
                (x < firstTouchRow - 1 || x > firstTouchRow + 1 ||
                    y < firstTouchColumn - 1 || y > firstTouchColumn + 1)
            ) {
                for (let i = x - 1; i < x + 2; ++i) {
                    for (let j = y - 1; j < y + 2; ++j) {
                        if (i >= 0 && i < options[difficulty].tableLength && j >= 0 && j < options[difficulty].tableLength) {
                            table[i][j].numberOfAdjacentMines += 1
                        }
                    }
                }
                table[x][y].isMine = true
                ++numberOfMine
            }
        }
    }

    return (
        <View style={styles.table}>
            {table.map((row, rowIndex) =>
                <View style={styles.row} key={rowIndex} >
                    {row.map((cell, cellIndex) => {
                        return (
                            <Pressable style={{ alignItems: "center", justifyContent: "center", width: width / options[difficulty].tableLength, aspectRatio: 1, backgroundColor: cell.isPressed ? colors.tileOpened : colors.tileClosed, borderWidth: 1 }} key={`${rowIndex}${cellIndex}`} onPress={() => onPress(rowIndex, cellIndex)} onLongPress={() => onLongPress(rowIndex, cellIndex)} >
                                {cell.isFlagged ? <Image source={require("../assets/redFlag.png")} style={{ width: width / options[difficulty].tableLength, height: width / options[difficulty].tableLength, resizeMode: "contain" }} /> :
                                    cell.isPressed ? cell.isMine ? <Image source={require("../assets/mine.png")} style={{ width: width / options[difficulty].tableLength, height: width / options[difficulty].tableLength, resizeMode: "contain" }} /> :
                                        <Text>{cell.numberOfAdjacentMines}</Text> : null}
                            </Pressable>
                        )
                    })}
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({

    table: {
        width: "100%",
        aspectRatio: 1,
        justifyContent: "space-evenly",
    },

    row: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-evenly",
    },

});