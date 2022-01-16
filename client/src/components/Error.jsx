import React from 'react'
import { AiOutlineStop } from 'react-icons/ai';
import { IconContext } from 'react-icons/lib';
 
const Error = (props) => {
    const {error} = props

    return (
        error &&
        <IconContext.Provider
            value={{color: 'red', size: '2rem', margin:'2rem'}}
        >
        <div className='error-page'>
            <h3 className='error'>{error} <AiOutlineStop/></h3>
        </div>
        </IconContext.Provider>
    )
}

export default Error
