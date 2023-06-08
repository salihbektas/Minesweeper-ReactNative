import { View, Image, Text } from "react-native"
import options from '../../options.json';

export default function Dashboard({difficulty, numOfFlags, numOfActiveMines}) {

    return (
        <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: "80%", backgroundColor: "lightgrey", paddingVertical: 8, borderRadius: 6 }}>
            <Text style={{ fontSize: 24 }} >{options[difficulty].numberOfMine}</Text>
            <Image source={require("../../assets/mine.png")} style={{ width: 30, aspectRatio: 1, resizeMode: "contain" }} />
            <Text style={{ fontSize: 24 }} >-</Text>

            <Text style={{ fontSize: 24 }} >{numOfFlags}</Text>
            <Image source={require("../../assets/redFlag.png")} style={{ width: 30, aspectRatio: 1, resizeMode: "contain" }} />

            <Text style={{ fontSize: 24 }} >=</Text>

            <Text style={{ fontSize: 24 }} >{numOfActiveMines}</Text>

        </View>
    )

}