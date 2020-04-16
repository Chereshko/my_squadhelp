import React from "react";

const TransactionTable = props => {
    const {transactions, className}=props;

    return(
        <table className={className}>
            <thead>
                <tr>
                    <th>##</th>
                    <th>Income</th>
                    <th>Expense</th>

                </tr>
            </thead>
            <tbody>
            {
                transactions.map(transaction => (
                    <tr key={transaction.id}>
                        <td>{transaction.id}</td>
                        <td>{transaction.isIncome
                            ? `${transaction.value } USD`
                            :  ''}</td>
                        <td>{transaction.isIncome
                            ? ''
                            :  `${transaction.value } USD`}</td>
                    </tr>
                ))
            }
            </tbody>
        </table>
    )
}

export default TransactionTable;