export function sanitizeUsers(user) {
  let newUser = user;
  delete newUser.password;
  return newUser;
}
