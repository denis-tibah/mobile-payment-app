import * as Yup from "yup";

export const checkUppercase = (str: any) => {
  for (var i = 0; i < str.length; i++) {
    if (
      str.charAt(i) == str.charAt(i).toUpperCase() &&
      str.charAt(i).match(/[a-z]/i)
    ) {
      return true;
    }
  }
  return false;
};

// check if a string contains any number
export const checkNumber = (str: any) => {
  for (let i = 0; i < str.length; i++) {
    if (!isNaN(str.charAt(i))) {
      return true;
    }
  }
  return false;
};

// check if a string contains a special character
export const checkSpecialCharacter = (str: any) => {
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  return specialChars.test(str);
};

// check if a string if an email
export const checkIfEmail = (str: any) => {
  const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regexEmail.test(str);
};

// check if a string contains all numbers
export const checkAllNumbers = (str: any) => {
  const regexNumbers = /[0-9]/;
  return regexNumbers.test(str);
};

export const validatePassword = (values: any) => {
  let errors: any = {};
  if (values.password !== values.confirmPassword)
    errors.confirmPassword = "Passwords do not match";
  if (values.password && values.password.length < 8)
    errors.password = "Password must be at least 8 characters";
  if (values.password && !checkUppercase(values.password))
    errors.password = "Password must contain at least one uppercase letter";
  if (values.password && !checkNumber(values.password))
    errors.password = "Password must contain at least one number";
  if (values.password && !checkSpecialCharacter(values.password))
    errors.password = "Password must contain at least one special character";
  if (!values.password) errors.password = "required";

  return errors;
};

export const validateLoginCredentials = (values: any) => {
  let errors: any = {};
  if (!values.email) errors.email = "required";
  if (values.email && !checkIfEmail(values.email))
    errors.email = "Please enter a valid email address";
  errors = { ...errors, ...validatePassword(values) };
  return errors;
};

export const validationPaymentSchema = (maxAmount: number) => {
  return Yup.object().shape({
    amount: Yup.number()
      .required("This is a required field*")
      .max(maxAmount, `This amount is above your daily limit`),
  });
};

export const validationAuthSchema = () => {
  return Yup.object().shape({
    email: Yup.string()
      .email("Please enter a valid email *")
      .required("Email is a required field *"),
    password: Yup.string().required("Password is a required field *"),
  });
};

export const validationAddingPayeeSchema = () => {
  return Yup.object().shape({
    beneficiaryName: Yup.string()
      .required("This is a required field*")
      .test("len", "Must include First name and Last name", (val) => {
        if (val) {
          const name = val.split(" ");
          return name.length > 1;
        } else {
          return false;
        }
      }),
    beneficiaryIban: Yup.string()
      .required("This is a required field *")
      .test("len", "Must be minimum of 3 characters", (val) => {
        if (val) {
          return val.length >= 3;
        } else {
          return false;
        }
      }),
    beneficiaryBic: Yup.string()
      .required("This is a required field*")
      .test("len", "Must be minimum of 3 characters", (val) => {
        if (val) {
          return val.length >= 3;
        } else {
          return false;
        }
      }),
  });
};
