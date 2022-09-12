import React from 'react'
import { ButtonStyled } from '../../styles/MaterialUi.styled'

const Button1 = (props) => {
    const {text, func} = props
  return (
    <ButtonStyled fullWidth onClick={func}>{text}</ButtonStyled>
  )
}

export default Button1