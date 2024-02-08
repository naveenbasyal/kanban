import * as Yup from "yup";

export const EditProjectValidation = Yup.object().shape({
  title: Yup.string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters long")
    .max(40, "Name must be at most 40 characters long"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters long")
    .max(200, "Description must be at most 200 characters long"),
});
