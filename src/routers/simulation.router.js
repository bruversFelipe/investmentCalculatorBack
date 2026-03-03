import { 
  createSimulation, 
  listSimulations, 
  getSimulation, 
  deleteSimulation 
} from '../controllers/simulation.controller.js';
import { validateToken } from '../utils/jwtoken.js';

export default function (router) {
  router.route('/simulation/create').post(validateToken, createSimulation);
  router.route('/simulation/list').get(validateToken, listSimulations);
  router.route('/simulation/:id').get(validateToken, getSimulation);
  router.route('/simulation/:id').delete(validateToken, deleteSimulation);
  return router;
}
