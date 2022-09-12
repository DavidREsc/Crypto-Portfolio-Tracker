import React from 'react'
import { CircularProgress } from '@mui/material'

const LoadingState = (props) => {
  const {text} = props
  return (
    <div style={{display: 'flex', gap: '1rem', height: '100%', alignItems:'center'}}>
		{text}
		<CircularProgress size={20} color='inherit'/>
    </div>
  )
}

export default LoadingState