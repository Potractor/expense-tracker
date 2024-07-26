import {View , Text , StyleSheet} from 'react-native';
import Button from './Button';
import { GlobalStyles } from '../constants/styles';
function ErrorOverLay({message, onConfirm}){
    return (
        <View style = {styles.container}>
            <Text style= {[styles.title, styles.text]}>An error occured!</Text>
            <Text style= {styles.text}>{message}</Text>
        </View>
    )
}

export default ErrorOverLay;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: GlobalStyles.colors.primary700,
    },
    text: {
        color: 'white',
        textAlign: 'center',
        marginBottom: 8
       },
       title: {
        fontSize: 20,
        fontWeight: 'bold',
       }
})