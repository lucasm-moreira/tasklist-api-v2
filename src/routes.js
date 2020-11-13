import { Router } from 'express';
import authMiddleware from './app/middlewares/auth';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import TaskController from './app/controllers/TaskController';

const routes = new Router();

routes.post('/users', UserController.store);

routes.post('/sessions', SessionController.store);

// Todas as rotas abaixo desse middleware precisam estar autenticadas
routes.use(authMiddleware);

routes.post('/sessions/logout', SessionController.logout);

routes.put('/users', UserController.update);

routes.get('/tasks', TaskController.index);
routes.post('/tasks', TaskController.store);
routes.put('/tasks/:task_id', TaskController.update);
routes.delete('/tasks/:task_id', TaskController.delete);

export default routes;
