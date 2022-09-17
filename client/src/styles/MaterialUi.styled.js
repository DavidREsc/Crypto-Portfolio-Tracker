import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import {styled} from '@mui/material/styles'

export const ButtonSignIn = styled(Button)({
	color: '#00bcd4',
	border: '1px solid #01579b',
	'&:hover': {
		color: 'hsl(187, 100%, 60%)',
		border: '1px solid 	hsl(206, 99%, 50%)',
		backgroundColor: 'rgba(0, 188, 212, 0.1)'
	},
	marginTop: '4rem',
	padding: '1rem'
})

export const ButtonDemo = styled(Button)({
	color: '#f57c00',
	border: '1px solid #e65100',
	'&:hover': {
		color: 'hsl(30, 100%, 65%)',
		border: '1px solid hsl(21, 100%, 60%)',
		backgroundColor: 'rgba(245, 124, 0, 0.1)'
	},
	marginTop: '1rem',
	padding: '1rem'
})

export const ButtonCreatePortfolio = styled(Button)({
	color: '#00bcd4',
	border: '1px solid #01579b',
	'&:hover': {
		color: 'hsl(187, 100%, 60%)',
		border: '1px solid 	hsl(206, 99%, 50%)',
		backgroundColor: 'rgba(0, 188, 212, 0.1)'
	},
	padding: '0.7rem',
	height: '100%',
})

export const ButtonStyled= styled(Button)({
	color: '#00bcd4',
	border: '1px solid #01579b',
	'&:hover': {
		color: 'hsl(187, 100%, 60%)',
		border: '1px solid 	hsl(206, 99%, 50%)',
		backgroundColor: 'rgba(0, 188, 212, 0.1)'
	},
})

export const ButtonTransaction = styled(Button)({
	color: 'hsl(151, 100%, 37%)',
	border: '1px solid 	hsl(145, 100%, 35%)',
	'&:hover': {
		color: 'hsl(151, 100%, 45%)',
		border: '1px solid 	hsl(145, 100%, 45%)',
		backgroundColor: 'rgba(0, 230, 118, 0.1)'
	},
	padding: '1rem'
})

export const ButtonDelete = styled(Button)({
	color: '#CCC',
	border: '1px solid #ff3333',
	backgroundColor: 'rgba(145, 17, 8, 0.7)',
	'&:hover': {
		color: '#CCC',
		border: '1px solid #ff3333',
		backgroundColor: 'rgba(145, 17, 8, 0.7)',

	},
	padding: '0.8rem',
	borderRadius: '30px'
})

export const ButtonCancel = styled(Button)({
	color: '#bdbdbd',
	border: '1px solid #757575',
	backgroundColor: 'rgba(117, 117, 117, 0.1)',
	'&:hover': {
		color: '#bdbdbd',
		border: '1px solid #757575',
		backgroundColor: 'hsl(0, 0%, 15%)',
	},
	padding: '0.8rem',
	borderRadius: '30px'
})

export const TextFieldSignIn = styled(TextField)({
	"& label": {
	  color: "#00bcd4"
	},
	"&:hover label": {
	  fontWeight: 700
	},
	"& label.Mui-focused": {
	  color: "#00bcd4"
	},
	"& .MuiInput-underline:after": {
	  borderBottomColor: "#01579b"
	},
	"& .MuiOutlinedInput-root": {
	  "& fieldset": {
		borderColor: "#01579b"
	  },
	  "&:hover fieldset": {
		borderColor: "#01579b",
		borderWidth: 2
	  },
	  "&.Mui-focused fieldset": {
		borderColor: "#01579b"
	  },
		input: {color:'#00bcd4'}
	},
	minHeight: '6rem'
});

export const TextFieldSearch = styled(TextField)({
	"& label": {
		color: "#00bcd4"
	  },
	  "&:hover label": {
		fontWeight: 700
	  },
	  "& label.Mui-focused": {
		color: "#00bcd4"
	  },
	  "& .MuiInput-underline:after": {
		borderBottomColor: "#01579b"
	  },
	  "& .MuiOutlinedInput-root": {
		"& fieldset": {
		  borderColor: "#01579b"
		},
		"&:hover fieldset": {
		  borderColor: "#01579b",
		  borderWidth: 2
		},
		"&.Mui-focused fieldset": {
		  borderColor: "#01579b"
		},
		  input: {color:'hsl(198, 16%, 74%)'},
		  fontSize: '1.2rem'
	  },
})

export const TextFieldTransaction = styled(TextField)({
	"& label": {
	  color: "hsl(198, 16%, 80%)",
	  fontSize: '1.1em'
	},
	"&:hover label": {
	  fontWeight: 700
	},
	"& label.Mui-focused": {
	  color: "hsl(198, 16%, 80%)",
	  fontSize: '1.2rem'
	},
	"& .MuiInput-underline:after": {
	  borderBottomColor: "#01579b"
	},
	"& .MuiOutlinedInput-root": {
	  "& fieldset": {
		borderColor: "#01579b"
	  },
	  "&:hover fieldset": {
		borderColor: "#01579b",
		borderWidth: 2
	  },
	  "&.Mui-focused fieldset": {
		borderColor: "#01579b"
	  },
		input: {color:'hsl(198, 16%, 80%)'},
		fontSize: '1.1rem'
	},
	height: '5rem'
});
