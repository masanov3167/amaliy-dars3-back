const express = require('express');
const category = require('../controller/category');
const courses = require('../controller/courses');

const router = express.Router();

const users = require('../controller/users');
const middleware = require('../middleware');

router
       .post('/users', middleware.checkContentType, users.Add)
       .post('/user_login',middleware.checkContentType, users.Login)
       .get('/users', middleware.checkContentType, users.Get)

       .get('/category', middleware.checkContentType, middleware.checkToken, category.Get)

       .get('/courses', middleware.checkContentType, courses.Get)
       .get('/my-courses', middleware.checkContentType, middleware.checkToken, courses.GetMy)
       .get('/courses-by-category/:id', middleware.checkContentType, middleware.checkToken, courses.GetByCategoryId)
       .put('/courses/:id', middleware.checkContentType, middleware.checkToken, courses.Edit)
       .post('/courses', middleware.checkContentType, middleware.checkToken, courses.Add)
       .delete('/courses/:id', middleware.checkContentType, middleware.checkToken, courses.Delete)
       .post('/courses_search',middleware.checkContentType, courses.Search)
       .post('/my-courses_search',middleware.checkContentType, middleware.checkToken, courses.SearchMy)



module.exports = router