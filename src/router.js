import {createRouter, createWebHistory} from 'vue-router';

import Users from "@/view/pages/Users/Users";
import DepartmentList from "@/view/pages/Departments/DepartmentList";
import IssueList from "@/view/pages/Issue/IssueList";
import IssueCreate from "@/components/Issue/IssueCreate";
import AuthService from "@/service/auth.service";
import TitleList from "@/components/Title/TitleList";
import Login from "@/view/LoginView";
import ContentView from "@/view/ContentView";

const routes = [
    {
        path: '/',
        name: 'content',
        component: ContentView,
        redirect: '/issueList',
        children: [
            {
                path: '/issueList',
                name: 'issueList',
                component: IssueList,
                meta: {
                    auth: true
                }
            },
            {
                path: '/issueCreate',
                name: 'issueCreate',
                component: IssueCreate,
                props: true,
                meta: {
                    auth: true
                }
            },
            {
                path: '/titleList',
                name: 'titleList',
                component: TitleList,
                meta: {
                    auth: true
                }
            },
            {
                path: '/users',
                name: 'users', component: Users,
                meta: {
                    auth: true
                }
            },
            {
                path: '/departmentList',
                name: 'departmentList',
                component: DepartmentList,
                meta: {
                    auth: true
                }
            },
        ],
        meta: {
            auth: true
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(function (to, from, next) {
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
