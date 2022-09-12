import React from 'react'
import { ButtonDemo } from '../../styles/MaterialUi.styled'
import LoadingState from './LoadingState'

const DemoButton = (props) => {
    const {text, demoLoading, demoLogin} = props
  return (
    <ButtonDemo variant='outlined' fullWidth type='button' onClick={demoLogin}>
		{!demoLoading && text}
		{demoLoading && 
			<LoadingState text='PLEASE WAIT'/>
		}
	</ButtonDemo>
  )
}

export default DemoButton