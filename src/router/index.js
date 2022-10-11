import Vue from 'vue';
import VueRouter from 'vue-router'
import Main from '@/views/Main.vue'
import Home from '@/views/Home.vue'
import Login from '@/views/Login'
import Register from '@/views/Register'

import BatchList from '@/views/ShowList/BatchList'

import DetailBatch from '@/views/Detail/DetailBatch'
import DetailSample from '@/views/Detail/DetailSample'

import PostBatch from '@/views/Post/PostBatch'
import PostSample from '@/views/Post/PostSample'

import UserManage from '@/views/SystemSetting/UserManage'
import Particle from "../views/Detail/AnalysisBatch/Particle";
import TE from "../views/Detail/AnalysisBatch/TE";
import SupportX from "../views/Detail/AnalysisBatch/SupportX";
import IsotopeCount from "../views/Detail/AnalysisBatch/IsotopeCount";
import AnalysisPure from "../views/Detail/AnalysisBatch/AnalysisPure";
import AnalysisNotPure from "../views/Detail/AnalysisBatch/AnalysisNotPure";
import BestModel from "../views/Detail/AnalysisBatch/BestModel";
import SupportXFile from "../views/Detail/FileManage/SupportXFile";

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Main',
        component: Main,
        redirect: '/batchList',     // 后面改成增加注册，要改成/login
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
            {
                path: 'batchList',
                name: 'batchList',
                component: BatchList,
                meta: {
                    login: true
                }
            },
            {
                path: 'detailBatch',
                name: 'detailBatch',
                component: DetailBatch
            },
            {
                path: 'DetailSample',
                name: 'DetailSample',
                component: DetailSample
            },
            {
                path: 'postBatch',
                name: 'postBatch',
                component: PostBatch
            },
            {
                path: 'postSample',
                name: 'postSample',
                component: PostSample
            },
            // 功能管理
            {
              path:'function/particle',
                name:'function_particle',
                component: Particle
            },
            {
                path:'function/TE',
                name:'function_TE',
                component: TE
            },
            {
                path:'function/isotopeCount',
                name:'function_isotopeCount',
                component: IsotopeCount
            },
            {
                path:'function/supportX',
                name:'function_supportX',
                component: SupportX
            },
            {
                path:'function/analysisPure',
                name:'function_analysisPure',
                component: AnalysisPure
            },
            {
                path:'function/analysisNotPure',
                name:'function_analysisNotPure',
                component: AnalysisNotPure
            },
            {
                path:'function/bestModel',
                name:'function_bestModel',
                component: BestModel
            },
            // 数据管理
            {
                path:'fileManage/supportXFile',
                name:'fileManage_supportXFile',
                component: SupportXFile
            },
            // 用户管理
             {
                path: 'systemSetting/userManage',
                name: 'systemSetting_userManage',
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