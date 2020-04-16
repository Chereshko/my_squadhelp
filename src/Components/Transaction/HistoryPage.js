import React from 'react';
import styles from './history.module.css';
import TransactionTable from "./TransactionTable";
import Header from '../Header/Header';
import {Link} from "react-router-dom";

const transactions = [
    {
        id: 1,
        isIncome: true,
        value: 3000,
    },
    {
        id: 2,
        isIncome: false,
        value: 2000,
    },
    {
        id: 3,
        isIncome: false,
        value: 750,
    },
    {
        id: 4,
        isIncome: true,
        value: 10000,
    },
    {
        id: 5,
        isIncome: false,
        value: 2500,
    },
    {
        id: 6,
        isIncome: false,
        value: 1800,
    }
]

const History = props => {
    return (
        <>
            <Header/>
            <div className={styles.outerContainer}>
                {
                    transactions ? <TransactionTable transactions={transactions} className={styles.table}/>
                        : (<div>There are no information for the period</div>)
                }
            </div>
        </>
    );
};

export default History;