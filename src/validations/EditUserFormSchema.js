import * as yup from "yup";

export const editUserFormSchema = yup.object({
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
  currentPassword: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{5,}$/,
      "Password must be at least 5 characters long, contain at least 1 uppercase letter, 1 lowercase letter, and 1 number."
    )
    .trim()
    .optional(),
  newPassword: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{5,}$/,
      "Password must be at least 5 characters long, contain at least 1 uppercase letter, 1 lowercase letter, and 1 number."
    )
    .trim(),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
    .trim(),
  profilePicture: yup.string().url("Invalid url").optional(),
  bio: yup.string().optional(),
  isPublic: yup.boolean().optional(),
});
