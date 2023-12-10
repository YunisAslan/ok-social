import * as yup from "yup";

export const editPostFormSchema = yup.object({
  title: yup.string().required("Title required!").trim(),
  imageURL: yup.string(),
});
