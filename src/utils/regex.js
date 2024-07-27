export default {
  email_regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  username_regex: /^(?=.*[a-zA-Z])[a-zA-Z0-9_]+$/,
  password_regex: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{6,}$/,
  name_regex: /^[\w.]+|[\p{Emoji}]+$/u,
};
