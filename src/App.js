import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

function App() {
  const [records, setRecords] = useState([]); // All fetched records
  const [filteredRecords, setFilteredRecords] = useState([]); // Filtered records for the search feature
  const [newTitle, setNewTitle] = useState(''); // Title for creating or editing
  const [search, setSearch] = useState(''); // Search input
  const [isEditing, setIsEditing] = useState(false); // Edit mode toggle
  const [editId, setEditId] = useState(null); // ID of the record being edited

  // Fetch data when the component loads
  useEffect(() => {
    fetchRecords();
  }, []);

  // Fetch records from API
  const fetchRecords = async () => {
    try {
      const response = await axios.get(API_URL);
      const fetchedRecords = response.data.slice(0, 10); // Limit to 10 posts
      setRecords(fetchedRecords);
      setFilteredRecords(fetchedRecords);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  // Handle creating or updating a record
  const handleSave = async () => {
    if (!newTitle.trim()) return alert('Title cannot be empty.');

    if (isEditing) {
      // Update record
      try {
        const updatedRecord = { title: newTitle };
        await axios.put(`${API_URL}/${editId}`, updatedRecord);
        const updatedRecords = records.map((record) =>
          record.id === editId ? { ...record, title: newTitle } : record
        );
        setRecords(updatedRecords);
        setFilteredRecords(updatedRecords);
        alert('Record updated successfully!');
      } catch (error) {
        console.error('Error updating record:', error);
      }
    } else {
      // Create record
      try {
        const newRecord = { title: newTitle };
        const response = await axios.post(API_URL, newRecord);
        const createdRecord = { ...response.data, id: records.length + 1 }; // Mock ID
        const updatedRecords = [createdRecord, ...records];
        setRecords(updatedRecords);
        setFilteredRecords(updatedRecords);
        alert('Record created successfully!');
      } catch (error) {
        console.error('Error creating record:', error);
      }
    }

    // Reset form
    setNewTitle('');
    setIsEditing(false);
    setEditId(null);
  };

  // Handle editing a record
  const handleEdit = (record) => {
    setIsEditing(true);
    setNewTitle(record.title);
    setEditId(record.id);
  };

  // Handle deleting a record
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      const updatedRecords = records.filter((record) => record.id !== id);
      setRecords(updatedRecords);
      setFilteredRecords(updatedRecords);
      alert('Record deleted successfully!');
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    setSearch(e.target.value);
    const searchValue = e.target.value.toLowerCase();
    const filtered = records.filter((record) =>
      record.title.toLowerCase().includes(searchValue)
    );
    setFilteredRecords(filtered);
  };

  return (
    <div className="container">
      <h1>React CRUD Application</h1>
      <input
        type="text"
        placeholder="Enter Name"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
      />
      <button onClick={handleSave}>{isEditing ? 'Update' : 'Create'}</button>
      <br />
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={handleSearch}
      />
      <ul className="record-list">
        {filteredRecords.map((record) => (
          <li key={record.id} className="record-item">
            <span>{record.title}</span>
            <button onClick={() => handleEdit(record)}>Edit</button>
            <button onClick={() => handleDelete(record.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
