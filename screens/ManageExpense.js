import { Text, View, StyleSheet } from "react-native"
import { useLayoutEffect, useState } from "react";
import IconButton from "../assets/IconButton";
import { GlobalStyles } from "../constants/styles";
import { useContext } from "react";
import { ExpensesContext } from "../store/expenses-context";
import Button from "../UI/Button";
import ExpenseForm from "../ManageExpense/ExpenseForm";
import { deleteExpense, storeExpense, updateExpense } from "../UI/http";
import LoadingOverlay from "../UI/LoadingOverlay";
import ErrorOverLay from "../UI/ErrorOverlay";
function ManageExpense({route, navigation}) {
   const [isSubmitting , setIsSubmitting] = useState(false);
   const [error , setError] = useState();
   const ExpensesCtx = useContext(ExpensesContext);

   const editedExpenseId = route.params?.expenseId;

   const selectedExpense = ExpensesCtx.expenses.find((expense)=> expense.id === editedExpenseId)
   const isEditing = !!editedExpenseId; // this will be false if the value is undefined;
   const cancelHandler = ()=>{
      navigation.goBack();
   }
   async function deleteExpenseHandler () {
      setIsSubmitting(true);
      
      try {
      await deleteExpense(editedExpenseId);
      ExpensesCtx.deleteExpense(editedExpenseId);
      }
      catch(error) {
         setError('Could not delete expense - please try again later!');
         setIsSubmitting(false);
      }
      navigation.goBack();
   }
   function errorHandler () {
      setError(null);
   }


   async function confirmHandler (expenseData) {
      setIsSubmitting(true);
      try {
      if(isEditing) {
         ExpensesCtx.updateExpense(editedExpenseId,expenseData);
         await updateExpense(editedExpenseId,expenseData);
      }
      else {
         const id = await storeExpense(expenseData);
         ExpensesCtx.addExpense(
          {...expenseData, id: id}
         );
      }
      navigation.goBack();
   } catch(error) {
      setError('Could not save data - please try again later!');
      setIsSubmitting(false);
   }
      
   }
   useLayoutEffect(()=> {
   navigation.setOptions( {
      title: isEditing? 'Edit Expense': 'Add Expense'
   });
}, [navigation , isEditing]);

if(error && !isSubmitting)
   return (<ErrorOverLay nessage ={error} onConfirm = {errorHandler}/>)

if(isSubmitting){
   return <LoadingOverlay/>}
   return <View style= {styles.container}>
      <ExpenseForm onCancel = {cancelHandler}
       onSubmit= {confirmHandler} submitButtonLabel = {isEditing? 'Update': 'Add'}
       defaultValues={selectedExpense}
      />
      {isEditing && <View style= {styles.deleteContainer}><IconButton icon= "trash" color = {GlobalStyles.colors.error500}  size = {36} onPress={deleteExpenseHandler}/>
      </View>}
   </View>
}
export default ManageExpense;

const styles = StyleSheet.create({
   container: {
     flex: 1,
     padding: 24,
     backgroundColor: GlobalStyles.colors.primary800,
   },
   buttons: {
     flexDirection: 'row',
     justifyContent: 'center',
     alignItems: 'center',
   },
   button: {
     minWidth: 120,
     marginHorizontal: 8,
   },
   deleteContainer: {
     marginTop: 16,
     paddingTop: 8,
     borderTopWidth: 2,
     borderTopColor: GlobalStyles.colors.primary200,
     alignItems: 'center',
   },
 });