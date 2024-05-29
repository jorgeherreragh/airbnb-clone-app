import { StyleSheet } from "react-native";
import Colors from "./Colors";

export const defaultStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDFFF'
    },
    inputField: {
        height: 44,
        borderWidth: 1,
        borderColor: '#ABABAB',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#fff'
    },
    button: {
        backgroundColor: Colors.primary,
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'poppins-bold'
    },
    buttonIcon: {
        position: 'absolute',
        left: 16
    },
    footer: {
        position: 'absolute',
        height: 100,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderTopColor: Colors.grey,
        borderTopWidth: StyleSheet.hairlineWidth
    }
});