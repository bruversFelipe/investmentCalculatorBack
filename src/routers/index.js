import authRouter from './auth.router.js';
import simulationRouter from './simulation.router.js';

export default function (route) {
  authRouter(route);
  simulationRouter(route);
  return route;
}
