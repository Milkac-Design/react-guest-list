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
  const [guestList, setGuestList] = useState([
    {
      name: 'Mario Milkovic',
      isAttending: true,
    },
    { name: 'Karl Horky', isAttending: true },
  ]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  //
  //API TRIALS
  //
  //

  //
  const [apiGuestList, setApiGuestList] = useState([]);
  //  GET ALL GUESTS
  const baseUrl = 'https://react-guest-list.herokuapp.com';
  useEffect(() => {
    async function getGuests() {
      const response = await fetch(`${baseUrl}/`);
      const allGuests = await response.json();
      setApiGuestList(allGuests);
      // console.log(allGuests);
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
    const fullName = [
      ...guestList,
      { name: `${firstName} ${lastName}`, isAttending: true },
    ];
    setGuestList(fullName);
    addGuest();
  };

  const removeGuest = (index) => {
    const removed = [...guestList];
    removed.splice(index, 1);
    setGuestList(removed);
  };

  const attending = (index) => {
    const isAttending = [...guestList];
    if (isAttending[index].isAttending === false) {
      isAttending[index].isAttending = true;
    } else {
      isAttending[index].isAttending = false;
    }
    setGuestList(isAttending);
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
        <h2>Guest List</h2>
      </div>
      <div>
        <ul css={guestListStyle}>
          {guestList.map((item, index) => (
            <li
              style={{ color: guestList[index].isAttending ? 'green' : 'red' }}
            >
              {item.name}
              <button onClick={() => attending(index)}>Attending</button>
              <button onClick={() => removeGuest(index)}>Remove</button>
            </li>
          ))}
        </ul>
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
