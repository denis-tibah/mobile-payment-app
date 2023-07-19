import React from 'react';

interface Transaction {
  amount: string;
  bic: string;
  currency: string;
  description: string;
  iban: string;
  id: number;
  name: string;
  reference_no: string;
  running_balance: string;
  service: null | string;
  status: string;
  transaction_datetime: string;
  transaction_id: number;
  transaction_uuid: string;
}

interface TransactionsByDate {
  [date: string]: Transaction[];
}

const MyComponent: React.FC = () => {
  const data: TransactionsByDate = {
    "2023-06-29": [
      { /* transaction object 1 */ },
      { /* transaction object 2 */ }
    ],
    "2023-07-03": [
      { /* transaction object 3 */ }
    ],
    // Add more dates and corresponding transactions here
  };

  return (
    <div>
      {Object.keys(data).map((date) => (
        <div key={date}>
          <h2>Transactions on {date}:</h2>
          <ul>
            {data[date].map((transaction, index) => (
              <li key={index}>
                <strong>Transaction {index + 1}:</strong> {JSON.stringify(transaction)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MyComponent;
