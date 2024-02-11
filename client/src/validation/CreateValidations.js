import * as Yup from "yup";

export const createValidation = Yup.object().shape({
  title: Yup.string()
    .required("Hey, you forgot to add the title! 🧐")
    .min(3, "Oh come on, that's shorter than a vine! 🌱")
    .max(40, "Whoa, slow down Shakespeare! Keep it under 40 characters. 📜"),
  description: Yup.string()
    .min(20, "Really? Add a bit more spice! 🔥")
    .max(300, "Easy there, Shakespeare! Keep it under 300 characters. 🎭"),
});
