import { Text } from "react-native"
import { useContext, useEffect, useState } from "react";
import { ExpensesContext} from "../store/expenses-context";
import ExpensesOutput from "../components/ExpensesOutput";
import { getDateMinusDays } from "../util/date";
import { fetchExpenses } from "../UI/http";
import LoadingOverlay from "../UI/LoadingOverlay";
import ErrorOverLay from "../UI/ErrorOverlay";

function RecentExpenses() {
   const [isFetching , setIsFetching] = useState(true);
   const [error, setError] = useState();
   const expensesCtx = useContext(ExpensesContext);
   useEffect(()=> {
      async function getExpenses() {
         setIsFetching(true);
         try {
         const expenses = await fetchExpenses();
         expensesCtx.setExpenses(expenses);}
         catch (error) {
            setError('Could not fetch expenses!');
         }
         setIsFetching(false);
         
      }
      getExpenses();
   },[]);

   function errorHandler() {
      setError(null);
   }

   if(error && !isFetching)
   {
      return <ErrorOverLay message = {error} onConfirm = {errorHandler}/>
   }
   if(isFetching) {
      return <LoadingOverlay/>
   }
   const recentExpenses = expensesCtx.expenses.filter((expense)=> {
      const today = new Date();
      const date7DaysAgo = getDateMinusDays(today,7);
      return expense.date > date7DaysAgo;
   })
   return <ExpensesOutput expenses={recentExpenses} expensePeriod = "Last 7 day"
   fallbackText = "No expenses registered for the last 7 days"/>
}
export default RecentExpenses;