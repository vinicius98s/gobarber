import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProvidersController from './app/controllers/ProvidersController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';
import AvailableController from './app/controllers/AvailableController';

import checkUserProvider from './app/middlewares/checkUserProvider';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

// Routes that doesnt use authentication
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

// Users
routes.put('/users', UserController.update);

// Files
routes.post('/files', upload.single('file'), FileController.store);

// Providers
routes.get('/providers', ProvidersController.index);
routes.get('/providers/:providerId/available', AvailableController.index);

// Appointments
routes.post('/appointments', checkUserProvider, AppointmentController.store);
routes.get('/appointments', AppointmentController.index);
routes.delete('/appointments/:id', AppointmentController.delete);

// Schedules
routes.get('/schedule', checkUserProvider, ScheduleController.index);

// Notifications
routes.get('/notifications', checkUserProvider, NotificationController.index);
routes.put(
  '/notifications/:id',
  checkUserProvider,
  NotificationController.update
);

export default routes;
