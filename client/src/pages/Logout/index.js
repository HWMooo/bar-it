import React, { useState, useEffect, Fragment } from 'react';

export default function Logout() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (localStorage.getItem('token') == null) {
        window.location.replace('http://localhost:8081/');
      } else {
        setLoading(false);
      }
    }, []);
  
    const handleLogout = e => {
      e.preventDefault();
  
      fetch('http://127.0.0.1:8000/api/v1/barrit/auth/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(data => {
          localStorage.clear();
          window.location.replace('http://localhost:8081/');
        });
    };
  
    return (
      <div>
        {loading === false && (
          <Fragment>
            <h1>Are you sure you want to logout?</h1>
            <input type='button' value='Logout' onClick={handleLogout} />
          </Fragment>
        )}
      </div>
    );
  };
