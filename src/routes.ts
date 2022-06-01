import express from 'express';

// Controllers
import EmployeeController from './controller/EmployeeController';
import UserAuth from './controller/UserAuthenticateController'
import ensureAuthenticated from './middleware/ensureAuthenticated';
import leaveSettings from './middleware/leave_setting';

const router = express.Router();

const employeeController = new EmployeeController();
const authenticateUserController = new UserAuth();


router.get("/api/employees", ensureAuthenticated, employeeController.getAllEmployees);
router.post('/api/employee', employeeController.create);
// router.get('/api/leave_settings', leaveSetting.getAllLeaveSettings);
router.post("/api/login", authenticateUserController.handle);

export default router;
