import * as yup from "yup";

export const newPostFormSchema = yup.object({
  title: yup.string().required("Title required!").trim(),
  imageURL: yup.string().required("Image required!").trim(),
});
