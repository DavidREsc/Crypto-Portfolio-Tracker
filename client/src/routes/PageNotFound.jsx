import React from 'react'
import {BiError} from 'react-icons/bi';

const PageNotFound = () => {
  return (
    <div className='page-not-found-container'>
        <BiError style={{marginTop: '10rem', marginRight: '0.5rem', fontSize: '1.5rem', color: 'orange'}}/>
        <h2 style={{marginTop: '10rem', color: '#e8e8e8'}}>Page not found</h2>
    </div>
  )
}

export default PageNotFound