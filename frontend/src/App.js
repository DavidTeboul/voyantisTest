import React, { useState, useEffect } from 'react'; // Import React and hooks
import axios from 'axios'; // Import axios to make HTTP requests
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);  // Current page
  const [totalPages, setTotalPages] = useState(1);  // Total number of pages
  const [limit, setLimit] = useState(10);  // Number of users per page

  function getUser() {
    setLoading(true); // Set loading to true when the button is clicked
    setError(null); // Reset error when trying to fetch a new user
    axios
      .get('http://localhost:3000/random-user')
      .then((response) => {
        setUser(response.data); // Set user data when the response is successful
        setLoading(false); // Stop loading when data is fetched
      })
      .catch((err) => {
        setError('Failed to fetch random user'); // Set error message if there is an issue
        setLoading(false); // Set loading to false in case of an error
      });
  }

  // Fetch random users with pagination
  const getUsers = () => {
    setLoading(true);
    setError(null);
    axios
      .get(`http://localhost:3000/Multiple-random-user`, {
        params: { page, limit }  // Pass page and limit as query params
      })
      .then((response) => {
        setUsers(response.data.users);  // Set the user data
        setTotalPages(response.data.totalPages);  // Set total pages
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch random users');
        setLoading(false);
      });
  };

  const openUserDetailsInPopup = (user) => {
    const userWindow = window.open("", "_blank", "width=600,height=400");
  
    // HTML content for the user details
    const userDetailsHtml = `
      <html>
        <head>
          <title>User Details</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
              color: #333;
            }
            .modal-content {
              background-color: white;
              padding: 20px;
              border-radius: 5px;
              width: 100%;
              max-width: 500px;
              margin: 20px auto;
              text-align: center;
            }
            .modal-user-image {
              width: 100%;
              height: auto;
              border-radius: 5px;
            }
            .close-button {
              position: absolute;
              top: 10px;
              right: 10px;
              font-size: 30px;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <div class="modal-content">
            <span class="close-button" onclick="window.close()">&#10005;</span>
            <h2>${user.name.first} ${user.name.last}</h2>
            <img src="${user.picture.large}" alt="${user.name.first} ${user.name.last}" class="modal-user-image" />
            <p>Email: ${user.email}</p>
            <p>Location: ${user.location.city}, ${user.location.state}, ${user.location.country}</p>
            <p>Username: ${user.login.username}</p>
            <p>Age: ${user.dob.age}</p>
          </div>
        </body>
      </html>
    `;
  
    // Write the HTML content to the new window
    userWindow.document.write(userDetailsHtml);
    userWindow.document.close(); // Close the document to render the content
  }; 

  const showDetails = (user) =>{
    setSelectedUser(user)
    setUserDetails(true);
    openUserDetailsInPopup(user); // Open user details in a new window

  }

  useEffect(() => {
    getUsers(); // Fetch users when page or limit changes
  }, [page, limit]);

  const closeModal = () => {
    setSelectedUser(null);  // Close the modal
  };

  return (
    <div className="App">
      <h1>Random Users</h1>

      {/* Show loading message if data is still being fetched */}
      {loading && <div>Loading...</div>}

      {/* Show error message if there's an error */}
      {error && <div>{error}</div>}

      {/* Display user data in a table format */}
      {users.length > 0 && (
        <table className="user-table">
          <thead>
            <tr>
              <th>Profile Picture</th>
              <th>Name</th>
              <th>Email</th>
              <th>Location</th>
              <th>Username</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} onClick={() => showDetails(user)}>
                <td>
                  <img 
                    src={user.picture.large} 
                    alt={`${user.name.first} ${user.name.last}`} 
                    className="user-image"
                  />
                </td>
                <td>{`${user.name.first} ${user.name.last}`}</td>
                <td>{user.email}</td>
                <td>{`${user.location.city}, ${user.location.state}, ${user.location.country}`}</td>
                <td>{user.login.username}</td>
                <td>{user.dob.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination controls */}
      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="page-button"
        >
          Previous
        </button>
        <span>{`Page ${page} of ${totalPages}`}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="page-button"
        >
          Next
        </button>
      </div>

       {/* Popup Modal for displaying user details */}
       {selectedUser && userDetails && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <h2>{`${selectedUser.name.first} ${selectedUser.name.last}`}</h2>
            <img
              src={selectedUser.picture.large}
              alt={`${selectedUser.name.first} ${selectedUser.name.last}`}
              className="modal-user-image"
            />
            <p>Email: {selectedUser.email}</p>
            <p>Location: {`${selectedUser.location.city}, ${selectedUser.location.state}, ${selectedUser.location.country}`}</p>
            <p>Username: {selectedUser.login.username}</p>
            <p>Age: {selectedUser.dob.age}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
