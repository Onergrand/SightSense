import {StyleSheet} from "react-native";

const createMainStyles = (fontSize) => StyleSheet.create({
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
    topMenuContainer: {
        height: 65,

        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',

        marginTop: '15%',
    },
    overlay: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0)',
        alignItems: 'center',
    },
    textButtonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',

        height: 'auto',
    },
    resizeTextButton: {
        height: '100%',
        width: '30%',

        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 15,

        justifyContent: 'center',
        alignItems: 'center',

        marginRight: '3%',
    },
    buttonTextResize: {
        fontSize: fontSize.buttonResize || 36,
        fontWeight: 'bold',
        fontFamily: 'MontserratBold',
    },
    cameraFill: {
        width: '100%',
        height: 150,

        backgroundColor: 'transparent',

        marginTop: '5%',
        marginBottom: '10%',

        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 15,
        borderStyle: 'dashed',
    },
    cameraFillText: {
        fontFamily: 'MontserratSemiBold',
        fontWeight: 'semibold',
        fontSize: fontSize.main || 24,
        color: '#000',

        textAlign: 'center',
        marginTop: '12%',
    },
    title: {
        fontFamily: 'MontserratBold',
        fontSize: fontSize.title || 48,
        fontWeight: 'bold',
        textAlign: 'center',

        marginTop: '5%',
        marginBottom: '2%',
    },
    input: {
        width: '80%',
        padding: 6,
        marginBottom: '4%',

        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 20,

        fontFamily: 'MontserratSemiBold',
        fontWeight: 'semibold',
        fontSize: fontSize.main || 24,
        color: '#000',
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

        marginTop: '10%',
    },
    loginButton: {
        width: '80%',
        height: '8%',

        backgroundColor: 'white',

        marginTop: '5%',
    },
    loginButtonText: {
        textAlign: 'center',

        fontFamily: 'MontserratBold',
        fontWeight: 'bold',
        fontSize: fontSize.main || 24,
        color: 'black',

        textDecorationLine: 'underline',
    },
    pointName: {
        fontFamily: 'MontserratSemiBold',
        fontWeight: 'semibold',
        fontSize: fontSize.main || 24,
        color: '#000',

        marginBottom: '2%',
    },
    placeholder: {
        fontFamily: 'MontserratSemiBold',
        fontWeight: 'semibold',
        fontSize: fontSize.main || 24,
        color: '#000',
    },
    cameraActions: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',

        width: '80%',
        height: '8%',
    },
    cameraActionButton: {
        width: '40%',
        height: '100%',

        backgroundColor: '#7B00E0',
        borderRadius: 20,

        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraActionButtonText: {
        fontFamily: 'MontserratSemiBold',
        fontWeight: 'semibold',
        fontSize: fontSize.main || 24,
        color: '#fff',
    },
    bottomMenu: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',

        width: '100%',
        height: '8%',

        position: 'absolute',
        bottom: 0,
    },
    bottomMenuButton: {
        width: '49%',
        height: '100%',

        backgroundColor: '#7B00E0',

        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: '30%',
        height: '60%',
    },
});

export default createMainStyles;
