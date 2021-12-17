import { createRouter, createWebHashHistory } from 'vue-router';
import Dashboard from './view/Dashboard.vue';
import Users from "./view/pages/Users/Users";
import DepartmentList from "./view/pages/Departments/DepartmentList";
import IssueList from "./view/pages/Issue/IssueList";
import IssueCreate from "./components/Issue/IssueCreate";
import AuthService from "./service/auth.service";
import Login from "./view/pages/view/Login";
const routes = [
    {
        path: '/',
        name: 'dashboard',
        component: Dashboard,
        meta: {
            auth: true
        }
    },


    {
        path: '/users',
        name: 'users',component: Users,
        meta: {
            auth: true
        }

    },


    {
        path: '/departmentList',
        name: 'departmentList',component: DepartmentList,
        meta: {
            auth: true
        }
    },
    {
        path: '/issueList',
        name: 'issueList',component: IssueList,
        meta: {
            auth: true
        }
    },
    {
        path: '/issueCreate',
        name: 'issueCreate',component: IssueCreate,
        props: true,

    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },


    {
        path: '/menu',component: Dashboard,
        children: [
            {
                path: '',component: Dashboard,
            },
            {
                path: '/menu/seat',component: Dashboard,
            },
            {
                path: '/menu/payment',component: Dashboard,
            },
            {
                path: '/menu/confirmation',component: Dashboard,
            },
        ],
    },

];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});
router.beforeEach(function(to, from, next) {
    window.scrollTo(0, 0);
    next();
});
router.beforeEach((to, from, next) => {

    if (!to.meta.auth)
        next();

    if (AuthService.isAuth())
        next();
    else
        next('/login');
})

export default router;
