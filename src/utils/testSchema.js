const {validateRegisterInput, registerSchema} = require('./validateInput')
const input = {
    email: "",
    password: "",
    confirmPassword: ""
}

const validate = async () => {
    await registerSchema.validate(input).then(() => console.log("hey")).catch((e) => console.log(e.errors))
    console.log("yo")
}

validate()



