import UserSchema from '../db/users.js';

import answerShell from '../middlewares/answerShell.js';
import errorLog from '../middlewares/errorLog.js';

import { compareCrypt, crypt } from '../utils/crypto.js';
import { createNewToken } from '../utils/jwtoken.js';
import { sanitizeUsers } from '../utils/sanitize.js';

export async function auth(req, res, next) {
  try {
    const payload = req.body;

    let user = await UserSchema.findOne({ email: payload.email }).lean();

    if (!user) {
      return res.json(answerShell({}, 'Usuário não existe', false));
    }

    const passwordValid = compareCrypt(payload.password, user.password);

    if (!passwordValid) {
      return res.json(answerShell({}, 'Senha invalida', false));
    }

    const getToken = createNewToken(user._id, payload.password);

    return res.json(
      answerShell(
        {
          user: sanitizeUsers(user),
          token: getToken,
        },
        'Logado',
        true,
      ),
    );
  } catch (err) {
    await errorLog(`Auth ${err.message}`);
    next(err);
    return res.json(answerShell({}, err.message, false));
  }
}

export async function createAccount(req, res, next) {
  try {
    let payload = req.body;

    const existingUser = await UserSchema.findOne({ email: payload.email }).lean();
    if (existingUser) {
      return res.json(answerShell({}, 'Email já cadastrado', false));
    }

    const originalPassword = payload.password;
    
    payload.password = crypt(payload.password);

    const newUser = await new UserSchema(payload).save();

    const getToken = createNewToken(newUser._id, originalPassword);

    return res.json(
      answerShell(
        {
          user: sanitizeUsers(newUser.toObject()),
          token: getToken,
        },
        'Usuário criado',
        true,
      ),
    );
  } catch (err) {
    await errorLog(`Auth createAccount ${err.message}`);
    next(err);
    return res.json(answerShell({}, err.message, false));
  }
}
