import * as yup from "yup";

export const registerFormSchema = yup.object({
  username: yup
    .string()
    .min(3, "You must use min 3 characters")
    .required("Username required!")
    .trim(),
  fullName: yup
    .string()
    .min(3, "You must use min 3 characters")
    .required("Fullname required!")
    .trim(),
  email: yup.string().email("Invalid email").required("Email required!").trim(),
  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{5,}$/,
      "Password must be at least 5 characters long, contain at least 1 uppercase letter, 1 lowercase letter, and 1 number."
    )
    .required("Password required!")
    .trim(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Required!")
    .trim(),
  isPublic: yup.boolean().optional(),
});
