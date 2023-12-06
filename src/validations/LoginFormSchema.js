import * as yup from "yup";

export const loginFormSchema = yup.object({
  username: yup.string().required("Username required!").trim(),
  password: yup.string().required("Password required!").trim(),
});
