// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    fetchData();
  }, [page, sortBy, searchTerm]);

  const fetchData = async () => {
    try {
      let url = `http://localhost:5000/customers?page=${page}`;
      if (sortBy) {
        url += `&sortBy=${sortBy}`;
      }
      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }
      const response = await axios.get(url);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className='container'>
      <h1>Customer Data</h1>
      <div className='sort-box'>
        <div>
          <input type="text" placeholder="Search by name or location" onChange={handleSearch}/>
        </div>
        <div className='sort-button'>
          <button onClick={() => handleSortChange('date')}>Sort by Date</button>
          <button onClick={() => handleSortChange('time')}>Sort by Time</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Customer Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan="7">No Records Found With Your Provided Input</td>
          </tr>
        ) : (
          data.map((customer) => (
            <tr key={customer.sno}>
              <td>{customer.sno}</td>
              <td>{customer.customer_name}</td>
              <td>{customer.age}</td>
              <td>{customer.phone}</td>
              <td>{customer.location}</td>
              <td>{new Date(customer.date).toISOString().split('T')[0]}</td>
              <td>{customer.time}</td>
            </tr>
          ))
        )}
      </tbody>

      </table>
      <div className='bottom-box'>
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <button onClick={() => handlePageChange(page + 1)}>Next</button>
      </div>
    </div>
  );
}

export default App;
