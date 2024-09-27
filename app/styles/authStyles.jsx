import {StyleSheet} from "react-native";

const createAuthStyles = (fontSize) => StyleSheet.create({
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
        height: 'auto',
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

        height: '20%',

        marginTop: '15%',
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

        marginTop: '10%',
        marginBottom: 20,
    },
    input: {
        width: '80%',
        padding: 10,
        marginBottom: 20,

        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 20,

        fontFamily: 'MontserratSemiBold',
        fontWeight: 'semibold',
        fontSize: fontSize.main || 24,
        color: '#000',
    },
    loginButton: {
        width: '40%',
        height: '8%',
        color: 'white',
        fontSize: fontSize.main || 24,

        backgroundColor: '#7B00E0',
        borderRadius: 20,
    },
    loginButtonText: {
        fontFamily: 'MontserratBold',
        fontWeight: 'bold',
        fontSize: fontSize.main || 24,
        color: 'white',


        textAlign: 'center',
        paddingTop: '6%',
    },
    linkText: {
        fontFamily: 'MontserratMedium',
        fontWeight: 'medium',
        fontSize: fontSize.main || 24,

        marginTop: '5%',
    },
    registerButton: {
        width: '80%',
        height: '8%',

        backgroundColor: 'white',

        marginTop: '5%',
    },
    registerButtonText: {
        textAlign: 'center',

        fontFamily: 'MontserratBold',
        fontWeight: 'bold',
        fontSize: fontSize.main || 24,
        color: 'black',

        textDecorationLine: 'underline',
    }
});

export default createAuthStyles;
