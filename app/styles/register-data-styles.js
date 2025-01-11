import {StyleSheet} from "react-native";

const createRegisterDataStyles = (fontSize) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',

        margin: 0,
        padding: 0,
        width: '100%',
    },
    background: {
        width: '100%',
    },
    overlay: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0)',
        alignItems: 'center',
    },
    textButtonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',

        height: 'auto',

        marginTop: '5%',
    },
    resizeTextButton: {
        width: '20%',
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 15,

        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        marginRight: '3%',
    },
    buttonTextResize: {
        fontSize: fontSize.buttonResize || 36,
        fontWeight: 'bold',
        fontFamily: 'MontserratBold',
        color: 'black',
    },
    buttonText: {
        fontSize: fontSize.button || 18,
        fontWeight: 'bold',
    },
    title: {
        fontFamily: 'MontserratBold',
        fontSize: fontSize.title || 48,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'black',
        marginTop: '5%',
        marginBottom: '10%',
    },
    input: {
        width: '80%',
        padding: 10,
        marginBottom: '10%',

        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 20,

        fontFamily: 'MontserratSemiBold',
        fontWeight: 'semibold',
        fontSize: fontSize.main || 24,
        color: '#000',
    },
    placeholder: {
        fontFamily: 'MontserratSemiBold',
        fontWeight: 'semibold',
        fontSize: fontSize.main || 24,
        color: '#000',
    },
    saveDataButton: {
        width: '50%',
        height: '8%',
        color: 'white',
        fontSize: fontSize.main || 24,

        backgroundColor: '#7B00E0',
        borderRadius: 20,
    },
    saveDataButtonText: {
        fontFamily: 'MontserratBold',
        fontWeight: 'bold',
        fontSize: fontSize.main || 24,
        color: 'white',


        textAlign: 'center',
        alignSelf: 'center',
        paddingTop: '6%',
    },
});

export default createRegisterDataStyles;
