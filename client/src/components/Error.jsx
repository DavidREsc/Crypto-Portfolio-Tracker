import React from 'react'
import { AiOutlineStop } from 'react-icons/ai';
 
const Error = (props) => {
    const {error} = props

    return (
        error &&
        <div className='error-page'>
            <AiOutlineStop style={{marginTop: '10rem', marginRight: '0.5rem', fontSize: '1.5rem', color: 'red'}}/>
            <h2 style={{marginTop: '10rem', color: '#e8e8e8'}}>{error}</h2>
        </div>
    )
}

export default Error
