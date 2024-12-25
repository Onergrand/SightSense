import {StyleSheet} from "react-native";

const createRegisterStyles = (fontSize) => StyleSheet.create({
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
        paddingLeft: 10,
        marginBottom: '10%',

        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 20,

        display: 'flex',
        flexDirection: 'row',

        fontFamily: 'MontserratSemiBold',
        fontWeight: 'semibold',
        fontSize: fontSize.main || 24,
        color: '#000',
    },
    inputPass: {
        width: '85%',

        fontFamily: 'MontserratSemiBold',
        fontWeight: 'semibold',
        fontSize: fontSize.main || 24,
        color: '#000',
    },
    iconButton: {
        alignSelf: 'center',
        width: '15%',
    },
    registerButton: {
        width: '40%',
        height: '10%',
        color: 'white',
        fontSize: fontSize.main || 24,

        backgroundColor: '#7B00E0',
        borderRadius: 20,
    },
    registerButtonText: {
        fontFamily: 'MontserratBold',
        fontWeight: 'bold',
        fontSize: fontSize.main || 24,
        color: 'white',


        textAlign: 'center',
        alignSelf: 'center',
        paddingTop: '3%',
    },
    linkText: {
        fontFamily: 'MontserratMedium',
        fontWeight: 'medium',
        fontSize: fontSize.main || 24,
        color: 'black',
        marginTop: '10%',
    },
    loginButton: {
        width: '80%',
        height: '8%',

        marginTop: '5%',
    },
    loginButtonText: {
        textAlign: 'center',

        fontFamily: 'MontserratBold',
        fontWeight: 'bold',
        fontSize: fontSize.main || 24,
        color: 'black',

        textDecorationLine: 'underline',
    }
});

export default createRegisterStyles;
