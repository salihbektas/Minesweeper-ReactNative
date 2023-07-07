import { View, Image, Text } from "react-native"
import options from '../../options.json';
import { useAtomValue } from "jotai";
import { store } from "../store";

export default function Dashboard({ numOfFlags }) {

    const difficulty = useAtomValue(store).difficulty

    const numOfActiveMines = options[difficulty].numberOfMine - numOfFlags

    return (
        <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: "80%", backgroundColor: "lightgrey", paddingVertical: 8, borderRadius: 6 }}>
            <View style={{flexDirection: 'row'}}>
                <Text style={{ fontSize: 28 }} >{options[difficulty].numberOfMine}</Text>
                <Image source={require("../../assets/mine.png")} style={{ width: 30, aspectRatio: 1, resizeMode: "contain", marginLeft: 5, marginTop: 5 }} />
            </View>

            <Text style={{ fontSize: 28 }} >-</Text>

            <View style={{flexDirection: 'row'}}>
                <Text style={{ fontSize: 28 }} >{numOfFlags}</Text>
                <Image source={require("../../assets/redFlag.png")} style={{ width: 30, aspectRatio: 1, resizeMode: "contain", marginLeft: 5, marginTop: 5 }} />
            </View>

            <Text style={{ fontSize: 28 }} >=</Text>

            <Text style={{ fontSize: 28 }} >{numOfActiveMines}</Text>

        </View>
    )

}