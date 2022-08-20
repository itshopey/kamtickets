const express = require('express');
const app = express();

// import controllers
const authController = require('./controllers/auth.controller');
const UserTicketController = require('./controllers/userticket.controller');
const AdminTicketController = require('./controllers/admin.controller');
const StaffTicketController = require('./controllers/staff.controller');



// import middlewares
const authCheck = require('./middlewares/auth');

// file upload
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads")
    },
    filename: function (req, file, cb) {
        const parts = file.mimetype.split("/");
        cb(null, `${req.body.fullname}.${parts[1]}`)
    }
})

const upload = multer({ storage });

// authentication
app.get('/admin', authController.loginpage);
app.post('/login', authController.signIn);
app.post('/register', authController.createUser);
app.get('/logout', authController.logout);
app.get('/choosedashboard', authController.chooseDashboard)
app.get('/noaccess', authController.noAccess);

// user
app.get('/', UserTicketController.homepage);

// admin
app.get('/admin/dashboard', authCheck.isAuthenticated, authCheck.isAdmin, AdminTicketController.admindashboard);

// user tickets
app.get('/createticket', UserTicketController.ticketform);
app.post('/createticket', upload.any(), UserTicketController.createTicket);
app.get('/tracktickets', UserTicketController.trackTicketPage);
app.post('/tracktickets', UserTicketController.trackTicket);
app.get('/user/ticket/:ticketid', UserTicketController.userViewTicket);
app.post('/user/comment', UserTicketController.userComment);

// staff amanagement
app.get('/addstaff', authCheck.isAuthenticated, authCheck.isAdmin, AdminTicketController.createStaffForm);
app.post('/addstaff', authCheck.isAuthenticated, authCheck.isAdmin, AdminTicketController.createStaff);
app.get('/allstaff', authCheck.isAuthenticated, authCheck.isAdmin, AdminTicketController.allStaff);
app.get('/staff/:id/delete', authCheck.isAuthenticated, authCheck.isAdmin, AdminTicketController.deleteStaff);
app.get('/staff/:id/edit', authCheck.isAuthenticated, authCheck.isAdmin, AdminTicketController.editStaffForm);
app.post('/editstaff', authCheck.isAuthenticated, authCheck.isAdmin, AdminTicketController.editStaff);
app.get('/staff/:id', authCheck.isAuthenticated, authCheck.isAdmin, AdminTicketController.findStaff);

// ticket management
app.get('/tickets', authCheck.isAuthenticated, AdminTicketController.allTickets);
app.get('/tickets/unassigned', authCheck.isAuthenticated, AdminTicketController.unassignedTickets);
app.get('/tickets/assigned', authCheck.isAuthenticated, AdminTicketController.assignedTickets);
app.get('/tickets/open', authCheck.isAuthenticated, AdminTicketController.openTickets);
app.get('/tickets/closed', authCheck.isAuthenticated, AdminTicketController.closedTickets);
app.get('/tickets/inprogress', authCheck.isAuthenticated, AdminTicketController.ticketsInProgress);
app.get('/ticket/:ticketid', authCheck.isAuthenticated, AdminTicketController.viewTicket);
app.post('/assignticket', authCheck.isAuthenticated, authCheck.isAdmin, AdminTicketController.assignTicket);
app.get('/closeticket/:ticketid', authCheck.isAuthenticated, authCheck.isAuthenticated, AdminTicketController.closeTicket);
app.post('/findtickets', authCheck.isAuthenticated, authCheck.isAdmin, authCheck.isAuthenticated, AdminTicketController.findTickets);
app.post('/admin/comment', authCheck.isAuthenticated, authCheck.isAdmin, AdminTicketController.adminComment);

// staff ticket management
app.get('/staffdashboard', authCheck.isAuthenticated, StaffTicketController.allStaffTickets);
app.get('/staffopentickets', authCheck.isAuthenticated, StaffTicketController.staffOpenTickets);
app.get('/staffinprogresstickets', authCheck.isAuthenticated, StaffTicketController.staffInProgressTickets);
app.get('/staffclosedtickets', authCheck.isAuthenticated, StaffTicketController.staffClosedTickets);
app.post('/stafffindtickets', authCheck.isAuthenticated, StaffTicketController.staffFindTickets);
app.get('/staff/ticket/:ticketid', authCheck.isAuthenticated, StaffTicketController.viewStaffTicket);
app.post('/staff/ticket/:ticketid', authCheck.isAuthenticated, StaffTicketController.updateTicket);
app.post('/staff/comment', authCheck.isAuthenticated, StaffTicketController.staffComment);




module.exports = app