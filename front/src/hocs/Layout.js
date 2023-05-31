import React from 'react'
import { UpperBar } from '../components/Navbars';

// adding Redux
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';


const Layout = ({children}) => {
  const isAuthenticated = useSelector(state => state.auth.is_auth);
  // const isAuthenticated =  false
  // const state =  useSelector(state => state.auth);

  // useEffect(() => {
  //   console.log('state >', state);
  // }, [])

  return (
      <span className='layout'>   
          {/* {isAuthenticated? <></>: <UpperBar /> }   */}
          {isAuthenticated? <></>:
            <div>
              {isAuthenticated == null?
                <div>
                  <Navigate to='/login' />
                  <UpperBar />
                </div>:<UpperBar />
              }
            </div>
          }  
          {children}
      </span>
  )
}
export default Layout;