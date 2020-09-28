import React, { useEffect, useState } from 'react';
import './App.css';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const mainStyle = css`
  font-size: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(
    #49494a calc(2%),
    #dedbdc calc(40%),
    #fbfbfb calc(70%)
  );
`;

const addGuestStyle = css`
  input {
    margin: 10px;
  }
  button {
    min-width: 50px;
    height: 25px;
    margin: 10px;
    background: #29b7d0;
    border-radius: 40px;
  }
`;

const guestListStyle = css`
  list-style-type: none;
  font-weight: 600;
  button {
    height: 25px;
    margin: 10px;
    background: #29b7d0;
    border-radius: 40px;
  }
`;

function App() {
  const [apiGuestList, setApiGuestList] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  //  GET ALL GUESTS
  const baseUrl = 'https://react-guest-list.herokuapp.com';
  useEffect(() => {
    async function getGuests() {
      const response = await fetch(`${baseUrl}/`);
      const allGuests = await response.json();
      setApiGuestList(allGuests);
    }
    getGuests();
  }, [apiGuestList]);
  //
  //ADD GUEST
  async function addGuest() {
    await fetch(`${baseUrl}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: `${firstName}`,
        lastName: `${lastName}`,
      }),
    });
  }
  //
  // REMOVE GUEST
  async function deleteGuest(id) {
    await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
  }
  //
  //UPDATE ATTENDING
  async function updateAttending(id) {
    await fetch(`${baseUrl}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: true }),
    });
  }
  async function updateNotAttending(id) {
    await fetch(`${baseUrl}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: false }),
    });
  }
  //
  const handleSubmit = (e) => {
    e.preventDefault();
    addGuest();
  };

  return (
    <div css={mainStyle}>
      <div>
        <h1>RSVP</h1>
      </div>
      <div>
        <form css={addGuestStyle} onSubmit={handleSubmit}>
          <label>
            First Name:
            <input
              onChange={(e) => setFirstName(e.target.value)}
              type="text"
              required
            />
          </label>
          <label>
            Last Name:
            <input
              onChange={(e) => setLastName(e.target.value)}
              type="text"
              required
            />
          </label>
          <button>Add</button>
        </form>
      </div>
      <div>
        <div>
          <h2>Api Guestlist</h2>
          <div>
            <ul css={guestListStyle}>
              {apiGuestList.map((item, index) => (
                <li
                  key={item.id}
                  style={{
                    color: apiGuestList[index].attending ? 'green' : 'red',
                  }}
                >
                  {item.firstName} {item.lastName}
                  <button onClick={() => updateAttending(item.id)}>
                    Attending
                  </button>
                  <button onClick={() => updateNotAttending(item.id)}>
                    Not Attending
                  </button>
                  <button onClick={() => deleteGuest(item.id)}>Remove</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
