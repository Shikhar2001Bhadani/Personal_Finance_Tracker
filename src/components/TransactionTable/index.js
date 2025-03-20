import React, { useState } from 'react'
import './styles.css'
import { Radio, Select, Table } from 'antd';
import searchImg from '../../assets/searchImg.svg'
import { parse, unparse } from 'papaparse';
import { toast } from 'react-toastify';

function TransactionsTable({ transactions, addTransaction, fetchTransactions }) {
  const { Option } = Select;
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Tag', dataIndex: 'tag', key: 'tag' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
  ];

  let filteredTransactions = transactions.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) &&
    item.type.includes(typeFilter)
  );

  let sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortKey === "date") return new Date(a.date) - new Date(b.date);
    else if (sortKey === "amount") return a.amount - b.amount;
    return 0;
  });

  function exportCSV() {
    const csv = unparse({
      fields: ["name", "type", "tag", "date", "amount"],
      data: transactions,
    });
    const data = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const csvURL = window.URL.createObjectURL(data);
    const tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'transactions.csv');
    tempLink.click();
  }

  function importFromCsv(event) {
    event.preventDefault();
    if (typeof addTransaction !== "function") {
      toast.error("Error: addTransaction is not a function.");
      return;
    }
  
    try {
      parse(event.target.files[0], {
        header: true,
        complete: async function (results) {
          for (const transaction of results.data) {
            if (!transaction.name || !transaction.amount || !transaction.date) {
              continue;
            }
            const newTransaction = {
              ...transaction,
              amount: parseFloat(transaction.amount) || 0,
            };
            await addTransaction(newTransaction, true);
          }
          toast.success("All transactions added!");
          fetchTransactions();
        },
        error: (error) => toast.error(error.message),
      });
  
      event.target.value = ""; // Reset file input
    } catch (e) {
      toast.error("Failed to import CSV");
    }
  }
  

  return (
    <div style={{ width: "97%", padding: "0rem 2rem" }}>

      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>

        <div className='input-flex'>
          <img src={searchImg} width="24px" alt="Search" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search by name' />
        </div>

        <Select
          className="select-input"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </div>

      <div className='my-table'>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: "1rem" }}>
          <h2>My Transactions</h2>
          <Radio.Group
            className="input-radio"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
            style={{justifyContent:"center"}}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="date">Sort by Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group>

          <div style={{ display: "flex", justifyContent: "right", gap: "1rem", width: "400px" }}>
            <button className='btn' onClick={exportCSV}>Export to CSV</button>
            <label htmlFor="file-csv" className='btn btn-blue'>Import from CSV</label>
            <input id='file-csv' type='file' accept='.csv' required onChange={importFromCsv} style={{ display: "none" }} />
          </div>
        </div>

        <Table dataSource={sortedTransactions.map((item, index) => ({ ...item, key: index }))} columns={columns} />
      </div>
    </div>
  )
}

export default TransactionsTable;
