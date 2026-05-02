const users = [];

export function getUsers() {
  return users;
}

export function findUserByEmail(email) {
  return users.find((u) => u.email === email);
}

export function findUserById(id) {
  return users.find((u) => u.id === id);
}

export function addUser(user) {
  users.push(user);
  return user;
}
