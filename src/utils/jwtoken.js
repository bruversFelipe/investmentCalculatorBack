import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;

export function createNewToken(userId) {
  const token = jwt.sign({ sub: { _id: userId } }, jwtSecret);

  return token;
}

export function validateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'No token provided!' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.sub._id;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: 'Falha na autenticação' });
  }
}
