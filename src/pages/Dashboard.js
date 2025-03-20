import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Cards from "../components/cards";

import AddExpenseModal from "../components/Modal/addExpense";
import AddIncomeModal from "../components/Modal/addIncome";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { toast } from "react-toastify";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import TransactionsTable from "../components/TransactionTable";
import Charts from "../components/Charts";
import NoTransactions from "../components/NoTransactions";
import ChartComponent from "../components/Charts";

function Dashboard() {
  const [transactions, setTrasnactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };
  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };
  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };
  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };
  const onFinish = (values, type) => {
    console.log("On Finish", values, type);
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  };

  async function addTransaction(transaction) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      toast.success("Transactions added");
      let newArr = transactions;
      newArr.push(transaction);
      setTrasnactions(newArr);
      calculateBalance();
    } catch (e) {
      console.error("Error Adding document", e);
      toast.error("could not add tansactions");
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expenseTotal = 0;
    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expenseTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setTotalBalance(incomeTotal - expenseTotal);
  };

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        transactionsArray.push(doc.data());
      });
      setTrasnactions(transactionsArray);
      toast.success("Transaction Fetched");
      console.log(transactionsArray);
    }
    setLoading(false);
  }

  let sortedTranscations = [...transactions].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
  {
    transactions.length !== 0 ? (
      <ChartComponent sortedTranscations={sortedTranscations} />
    ) : (
      <NoTransactions />
    );
  }

  return (
    <div>
      <Header />
      {loading ? (
        <p>Loading....</p>
      ) : (
        <>
          <Cards
            income={income}
            expense={expense}
            totalBalance={totalBalance}
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
          />
          {transactions.length != 0 ? (
            <ChartComponent sortedTransactions={sortedTranscations} />
          ) : (
            <NoTransactions />
          )}
          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          <TransactionsTable
            transactions={transactions}
            addTransaction={addTransaction}
            fetchTransactions={fetchTransactions}
          />
        </>
      )}
    </div>
  );
}

export default Dashboard;
