import React from 'react'
import { ButtonCreatePortfolio } from '../../styles/MaterialUi.styled'
import LoadingState from './LoadingState'

const CreatePortfolioBtn = (props) => {
    const {text, loading} = props
  return (
    <ButtonCreatePortfolio variant='outlined' fullWidth type='submit'>
		{!loading && text} 
		{loading && 
			<LoadingState text='PLEASE WAIT'/>
		}
	</ButtonCreatePortfolio>
  )
}

export default CreatePortfolioBtn