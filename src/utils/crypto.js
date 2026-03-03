import bcrypt from 'bcryptjs';

export function crypt(str) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(str, salt);

  return hash;
}

export function compareCrypt(str, password) {
  return bcrypt.compareSync(str, password);
}
