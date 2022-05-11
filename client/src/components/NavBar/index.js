import React, {Fragment, useState, useEffect} from 'react';
import { useNavigate as Navigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import './styles.css'



function NavBar() {
    const [isAuth, setIsAuth] = useState(false);
    const goTo = Navigate();

    useEffect(() => {
        if (localStorage.getItem('token') !== null) {
          setIsAuth(true);
        }
      }, []);
    

    function goBack() {
        goTo(-1);
    }

    return (<>
        { isAuth === true ? ( 
            <Fragment>

                <NavLink role="dashboard" to='/dashboard'>Dashboard</NavLink>
                <NavLink to='/logout'>Logout</NavLink>
                <NavLink role="settings-button" to="settings"  className='link' ><h1>settings</h1></NavLink>
                <NavLink role="previoussearch-button" to="previous"  className='link' ><h1>previous</h1></NavLink>
                <button role="back-button" className='BackBtn' onClick={goBack}>Back</button>
                <NavLink role="about-button" to="about"  className='link' ><h1>about</h1></NavLink>
                <NavLink role="home-button" to="" className='link' activeClassName="active"><h1>Home</h1></NavLink>

            </Fragment>
            ): (
                <Fragment>
                    <NavLink role="login-button" to="login"  className='link' ><h1>login</h1></NavLink>
                    <NavLink role="signup-button" to="signup"  className='link' ><h1>signup</h1></NavLink>
                </Fragment>
            )}
        {/* <NavLink role="login-button" to="login"  className='link' ><h1>login</h1></NavLink>
        <NavLink role="signup-button" to="signup"  className='link' ><h1>signup</h1></NavLink> */}
    </>)

}

export default NavBar;
