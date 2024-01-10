import * as Yup from "yup";

const schemaWithStringAndNumber = Yup.mixed()
  .test(
    "is-string-or-number",
    "Must be a combination of letter and number",
    (value) => {
      if (typeof value !== "string" && typeof value !== "number") {
        return false; // Value is not a string or number
      }

      // Check if the value contains at least one digit (number)
      if (typeof value === "string" && !/\d/.test(value)) {
        return false; // Value is a string without a number
      }

      return true; // Value is either a string with a number or a number
    }
  )
  .required("Value is required");

const addressDetailsSchema = Yup.object({
  street: schemaWithStringAndNumber,
  subStreet: schemaWithStringAndNumber,
  town: Yup.string().required("Required"),
  state: Yup.string().required("Required"),
  postCode: Yup.string().required("Required"),
  country: Yup.string().required("Required"),
  noOfMonths: Yup.string().required("Required"),
  noOfYears: Yup.string().required("Required"),
  /*  additionalStreet: Yup.string().test(
    "check additionalStreet value if empty show error based on noOfYears < 3",
    function () {
      const { noOfYears, noOfMonths, additionalStreet } = this.parent;
      let years = parseInt(noOfYears, 10);

      const months = parseInt(noOfMonths, 10);
      if (months === 12) years += 1;

      if (years < 3) {
        // Value is not a string or number
        if (
          typeof additionalStreet !== "string" &&
          typeof additionalStreet !== "number"
        ) {
          return this.createError({
            message: "Must be a combination of letter and number",
          });
        }
        // Value is a string without a number
        if (
          typeof additionalStreet === "string" &&
          !/\d/.test(additionalStreet)
        ) {
          return this.createError({
            message: "Must be a combination of letter and number",
          });
        }
        return true;
      } else {
        return true;
      }
    }
  ), */
  additionalStreet: Yup.string().test(
    "check additionalSubStreet value if empty show error based on noOfYears < 3",
    function () {
      const { noOfYears, noOfMonths, additionalStreet } = this.parent;
      let years = parseInt(noOfYears, 10);
      const months = parseInt(noOfMonths, 10);
      if (months === 12) years += 1;

      if (additionalStreet) {
        return true;
      }
      if (years < 3) {
        return this.createError({ message: "Required" });
      } else {
        return true;
      }
    }
  ),
  additionalSubStreet: Yup.string().test(
    "check additionalSubStreet value if empty show error based on noOfYears < 3",
    function () {
      const { noOfYears, noOfMonths, additionalSubStreet } = this.parent;
      let years = parseInt(noOfYears, 10);
      const months = parseInt(noOfMonths, 10);
      if (months === 12) years += 1;

      if (additionalSubStreet) {
        return true;
      }
      if (years < 3) {
        return this.createError({ message: "Required" });
      } else {
        return true;
      }
    }
  ),
  /*  additionalSubStreet: Yup.string().test(
    "check additionalStreet value if empty show error based on noOfYears < 3",
    function () {
      const { noOfYears, noOfMonths, additionalSubStreet } = this.parent;
      let years = parseInt(noOfYears, 10);
      const months = parseInt(noOfMonths, 10);
      if (months === 12) years += 1;

      if (years < 3) {
        // Value is not a string or number
        if (
          typeof additionalSubStreet !== "string" &&
          typeof additionalSubStreet !== "number"
        ) {
          return this.createError({
            message: "Must be a combination of letter and number",
          });
        }

        // Value is a string without a number
        if (
          typeof additionalSubStreet === "string" &&
          !/\d/.test(additionalSubStreet)
        ) {
          return this.createError({
            message: "Must be a combination of letter and number",
          });
        }
        return true;
      } else {
        return true;
      }
    }
  ), */
  additionalPostcode: Yup.string().test(
    "check additionalPostcode value if empty show error based on noOfYears < 3",
    function () {
      const { noOfYears, noOfMonths, additionalPostcode } = this.parent;
      let years = parseInt(noOfYears, 10);
      const months = parseInt(noOfMonths, 10);
      if (months === 12) years += 1;

      if (additionalPostcode) {
        return true;
      }
      if (years < 3) {
        return this.createError({ message: "Required" });
      } else {
        return true;
      }
    }
  ),
  additionalTown: Yup.string().test(
    "check additionalTown value if empty show error based on noOfYears < 3",
    function () {
      const { noOfYears, noOfMonths, additionalTown } = this.parent;
      let years = parseInt(noOfYears, 10);
      const months = parseInt(noOfMonths, 10);
      if (months === 12) years += 1;

      if (additionalTown) {
        return true;
      }
      if (years < 3) {
        return this.createError({ message: "Required" });
      } else {
        return true;
      }
    }
  ),
  additionalState: Yup.string().test(
    "check additionalState value if empty show error based on noOfYears < 3",
    function () {
      const { noOfYears, noOfMonths, additionalState } = this.parent;
      let years = parseInt(noOfYears, 10);
      const months = parseInt(noOfMonths, 10);
      if (months === 12) years += 1;

      if (additionalState) {
        return true;
      }
      if (years < 3) {
        return this.createError({ message: "Required" });
      } else {
        return true;
      }
    }
  ),
  additionalCountry: Yup.string()
    .test(
      "check additionalCountry value if empty show error based on noOfYears < 3",
      function () {
        const { noOfYears, noOfMonths, additionalCountry } = this.parent;
        let years = parseInt(noOfYears, 10);
        const months = parseInt(noOfMonths, 10);
        if (months === 12) years += 1;

        if (additionalCountry) {
          return true;
        }
        if (years < 3) {
          return this.createError({ message: "Required" });
        } else {
          return true;
        }
      }
    )
    .notRequired(),
  additionalNoofmonths: Yup.string().test(
    "check additionalNoofmonths value if empty show error based on noOfYears < 3",
    function () {
      const { noOfYears, noOfMonths, additionalNoofmonths } = this.parent;
      let years = parseInt(noOfYears, 10);
      const months = parseInt(noOfMonths, 10);
      if (months === 12) years += 1;

      if (additionalNoofmonths) {
        return true;
      }
      if (years < 3) {
        return this.createError({ message: "Required" });
      } else {
        return true;
      }
    }
  ),
  additionalNoofyears: Yup.string().test(
    "check additionalNoofyears value if empty show error based on noOfYears < 3",
    function () {
      const { noOfYears, noOfMonths, additionalNoofyears } = this.parent;
      let years = parseInt(noOfYears, 10);
      const months = parseInt(noOfMonths, 10);
      if (months === 12) years += 1;

      if (additionalNoofyears) {
        return true;
      }
      if (years < 3) {
        return this.createError({ message: "Required" });
      } else {
        return true;
      }
    }
  ),
});

const financialDetailsSchema = Yup.object({
  annualSalary: Yup.string().required("Required"),
  sourceOfWealth: Yup.string().required("Required"),
  employmentStatus: Yup.string().required("Required"),
  occupation: Yup.string().required("Required"),
  employerName: Yup.string().required("Required"),
  positionHeld: Yup.string().required("Required"),
  lengthWithEmployer: Yup.string().required("Required"),
  natureOfBusiness: Yup.string().required("Required"),
});

const loginCredentialsSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  alternateEmail: Yup.string()
    .email("Invalid email address")
    .when("email", {
      is: true,
      then: Yup.string().required("Must enter email address"),
    }),
  countryCode: Yup.string().required("Country code is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
});

const profileDetailsSchema = Yup.object({
  salutation: Yup.string().required("Required"),
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  dob: Yup.string().required("Required"),
  placeOfBirth: Yup.string().required("Required"),
  /* countryOfBirth: Yup.object()
    .shape({
      label: Yup.string(),
      value: Yup.string(),
    })
    .test("At least one of these fields needs to be filled", function (value) {
      if (!value.value || !value.label) {
        return this.createError({ message: "Required" });
      }
      return true;
    })
    .required("Required"), */
  countryOfBirth: Yup.string().required("Required"),
  /* nationality: Yup.object()
    .shape({
      alpha2: Yup.string(),
      alpha3: Yup.string(),
      name: Yup.string(),
      nationality: Yup.string(),
      numeric: Yup.number(),
    })
    .test("At least one of these fields needs to be filled", function (value) {
      if (!value.value || !value.label) {
        return this.createError({ message: "Required" });
      }
      return true;
    })
    .required("Required"), */
  nationality: Yup.string().required("Required"),
});

const termsAndConditionSchema = Yup.object({
  termsAndConditions: Yup.boolean().oneOf([true], "Required"),
  readPrivacyPolicy: Yup.boolean().oneOf([true], "Required"),
  newsLetterSubscription: Yup.boolean().notRequired(),
});

const verifyPhoneNumberSchema = Yup.object({
  countryCode: Yup.string().required("Country code  is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
});

const forgottenPasswordSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const editProfileSchema = Yup.object({
  salutation: Yup.string().required("Required"),
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  annualSalary: Yup.string().required("Required"),
  sourceOfWealth: Yup.string().required("Required"),
  street: Yup.string().notRequired(),
  subStreet: Yup.string().notRequired(),
  town: Yup.string().notRequired(),
  state: Yup.string().notRequired(),
  postCode: Yup.string().notRequired(),
  country: Yup.string().notRequired(),
});

const securityTabSchema = Yup.object({
  password: Yup.string()
    .required("Required")
    .min(8, "Minimum of 8 characters")
    .matches(/^(?=.*[A-Z])/, "Must Contain at least one uppercase character")
    .matches(/^(?=.*[0-9])/, "Must Contain at least one Number")
    .matches(
      /^(?=.*[!@#\$%\^&\*])/,
      "Must contain at least one special character"
    ),
  oldPassword: Yup.string()
    .required("Required")
    .min(8, "Minimum of 8 characters")
    .matches(/^(?=.*[A-Z])/, "Must Contain at least one uppercase character")
    .matches(/^(?=.*[0-9])/, "Must Contain at least one Number")
    .matches(
      /^(?=.*[!@#\$%\^&\*])/,
      "Must contain at least one special character"
    ),
  passwordConfirmation: Yup.string()
    .required("Required")
    .min(8, "Minimum of 8 characters")
    .matches(/^(?=.*[A-Z])/, "Must Contain at least one uppercase character")
    .matches(/^(?=.*[0-9])/, "Must Contain at least one Number")
    .matches(
      /^(?=.*[!@#\$%\^&\*])/,
      "Must contain at least one special character"
    )
    .oneOf([Yup.ref("password")], "Passwords do not match"),
});

export {
  addressDetailsSchema,
  financialDetailsSchema,
  loginCredentialsSchema,
  profileDetailsSchema,
  termsAndConditionSchema,
  verifyPhoneNumberSchema,
  forgottenPasswordSchema,
  editProfileSchema,
  securityTabSchema,
};
