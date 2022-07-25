import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import staffController from "../controllers/staffController";
import customerController from "../controllers/customerController";
import serviceController from "../controllers/serviceController";
import newsController from "../controllers/newsController";
import showroomController from "../controllers/showroomController";
import searchController from "../controllers/searchController";
import bookingController from "../controllers/bookingController";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/crud', homeController.getCRUD);
    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.displayGetCRUD);
    router.get('/edit-crud', homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);

    //API
    router.post('/api/login', userController.handleLogin)
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser); //restAPI
    router.get('/api/allcode', userController.getAllCode);

    router.get('/api/top-staff-home', staffController.getTopStaffHome);
    router.get('/api/get-all-staffs', staffController.getAllStaffs);
    router.post('/api/save-infor-staffs', staffController.postInforStaffs);
    router.get('/api/get-detail-staff-by-id', staffController.getDetailStaffById);
    router.post('/api/bulk-create-schedule', staffController.bulkCreateSchedule);
    router.get('/api/get-schedule-staff-by-date', staffController.getScheduleByDate);
    router.get('/api/get-extra-infor-staff-by-id', staffController.getExtraInforStaffById);
    router.get('/api/get-profile-staff-by-id', staffController.getProfileStaffById);
    router.get('/api/get-list-customer-for-staff', staffController.getListCustomerForStaff);
    router.post('/api/send-remedy', staffController.sendRemedy);

    router.post('/api/customer-book-appointment', customerController.postBookAppointment);
    router.post('/api/verify-book-appointment', customerController.postVerifyBookAppointment);
    router.get('/api/get-list-booking-customer', customerController.getListBookingCustomer);

    router.post('/api/create-new-service', serviceController.createService);
    router.get('/api/get-all-service', serviceController.getAllService);
    router.get('/api/get-top-service', serviceController.getTopService);
    router.get('/api/get-detail-service-by-id', serviceController.getDetailServiceById);
    router.delete('/api/delete-service', serviceController.handleDeleteService);
    router.put('/api/edit-service', serviceController.handleEditService);

    router.post('/api/create-news', newsController.createNews);
    router.get('/api/get-all-news', newsController.getAllNews);
    router.get('/api/get-top-news', newsController.getTopNews);
    router.get('/api/get-detail-news-by-id', newsController.getDetailNewsById);
    router.delete('/api/delete-news', newsController.handleDeleteNews);
    router.put('/api/edit-news', newsController.handleEditNews);

    router.post('/api/create-new-showroom', showroomController.createShowroom);
    router.get('/api/get-showroom', showroomController.getAllShowroom);
    router.get('/api/get-top-showroom', showroomController.getTopShowroom);
    router.get('/api/get-detail-showroom-by-id', showroomController.getDetailShowroomById);
    router.delete('/api/delete-showroom', showroomController.handleDeleteShowroom);
    router.put('/api/edit-showroom', showroomController.handleEditShowroom);

    router.get('/api/get-search-by-keyword', searchController.getSearchByKeyword);

    router.post('/api/customer-login', customerController.handleCustomerLogin);
    router.post('/api/customer-register', customerController.handleCustomerRegister);

    router.get('/api/get-all-booking', bookingController.getAllBooking);
    router.delete('/api/delete-booking', bookingController.handleDeleteBooking);

    return app.use("/", router);
}

module.exports = initWebRoutes;