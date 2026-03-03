import { auth, createAccount } from '../controllers/auth.controller.js';

export default function (router) {
  router.route('/auth').post(auth);
  router.route('/create').post(createAccount);
  return router;
}
