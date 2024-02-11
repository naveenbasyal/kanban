import * as Yup from "yup";

export const registerValidation = Yup.object().shape({
  username: Yup.string()
    .required("Come on, give yourself a name!")
    .min(3, "That's a bit too short, don't you think?")
    .max(15, "Whoa, easy there! Keep it under 15 characters"),
  email: Yup.string()
    .email("Uh-oh, that doesn't look like an email address")
    .required("Don't forget to enter your email, wizard!"),
  password: Yup.string()
    .required("Password is like a secret handshake, you need one!")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
      "Make it more magical! Include at least one uppercase letter, one lowercase letter, and one number."
    ),
});

export const loginValidation = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email, are you a robot?")
    .required("Email is your magical key, don't lose it!"),
  password: Yup.string().required("Password is your secret spell, cast it!"),
});
