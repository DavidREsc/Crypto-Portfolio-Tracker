import * as yup from 'yup'

export const signUpSchema = yup.object().shape({
    email: yup.string()
      .email('Invalid email').required("Please enter your email"),
    password: yup.string()
      .required("Please enter a password")
      .min(8, 'Password must be at least 8 characters'),
      confirmPassword: yup.string()
      .required('Please confirm your password')
      .oneOf([yup.ref('password')], 'Passwords do not match')
})

export const loginSchema = yup.object().shape({
  email: yup.string()
    .email('Invalid email').required("Please enter your email"),
  password: yup.string()
    .required("Please enter your password")
})

export const transactionSchema = yup.object().shape({
  quantity: yup.number()
    .required('Quantity is required')
    .positive('Quantity must be greater than 0')
    .typeError('Quantity is required'),
  pricePerCoin: yup.number()
    .required('Price is required')
    .positive('Price must be greater than 0')
    .typeError('Price is required')
})

export const createPortfolioSchema = yup.object().shape({
  name: yup.string()
    .required('Please enter a name')
    .max(24, 'Character limit: 24')
})
