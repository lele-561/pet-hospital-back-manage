import Vue from 'vue';
import VueRouter from 'vue-router'
import Main from '@/views/Main.vue'
import Home from '@/views/Home.vue'
import Login from '@/views/Login'
import Register from '@/views/Register'

import DepartmentManage from "../views/Detail/BasicManage/DepartmentManage";
import DrugManage from "../views/Detail/BasicManage/DrugManage";
import InspectionManage from "../views/Detail/BasicManage/InspectionManage";
import PeronnelManage from "../views/Detail/BasicManage/PeronnelManage";
import DiseaseExample from "../views/Detail/DiseaseManage/DiseaseExample";
import DiseaseReal from "../views/Detail/DiseaseManage/DiseaseReal";
import ExamManage from "../views/Detail/TestManage/ExamManage";
import PaperManage from "../views/Detail/TestManage/PaperManage";
import QuestionManage from "../views/Detail/TestManage/QuestionManage";
import UserManage from "../views/Detail/UserManage";

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Main',
    component: Main,
    redirect: '/login',     // 后面改成增加注册，要改成/login
    meta: {
        login: true
    },
    children: [{
        path: 'home',
        name: 'home',
        component: Home,
        meta: {
            login: true
        }
    },
        // 基本管理
        {
            path: 'basicManage/department',
            name: 'basicManage_department',
            component: DepartmentManage,
            meta: {
                login: true
            }
        },
        {
            path: 'basicManage/drug',
            name: 'basicManage_drug',
            component: DrugManage
        },
        {
            path: 'basicManage/inspection',
            name: 'basicManage_inspection',
            component: InspectionManage
        },
        {
            path: 'basicManage/peronnel',
            name: 'basicManage_peronnel',
            component: PeronnelManage
        },
        // 疾病管理
        {
            path: 'diseaseManage/diseaseReal',
            name: 'diseaseManage_diseaseReal',
            component: DiseaseReal
        },
        {
            path: 'diseaseManage/diseaseExample',
            name: 'diseaseManage_diseaseExample',
            component: DiseaseExample
        },
        // 测试管理
        {
            path: 'testManage/exam',
            name: 'testManage_exam',
            component: ExamManage
        },
        {
            path: 'testManage/paper',
            name: 'testManage_paper',
            component: PaperManage
        },
        {
            path: 'testManage/question',
            name: 'testManage_question',
            component: QuestionManage
        },
        // 用户管理
        {
            path: 'userManage',
            name: 'userManage',
            component: UserManage,
            meta: {
                login: true
            }
        },
    ]
},
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            login: false
        }
    },
    {
        path: '/register',
        name: 'register',
        component: Register,
        meta: {
            login: false
        }
    }
]

const router = new VueRouter({
    mode: 'hash',
    routes
})

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

export default router