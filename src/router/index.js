import Vue from 'vue';
import VueRouter from 'vue-router'
import Main from '@/views/Main.vue'
import Home from '@/views/Home.vue'
import Login from '@/views/Login'
import Register from '@/views/Register'

import DatasetList from '@/views/ShowList/DatasetList'
import PaperList from '@/views/ShowList/PaperList'

import PaperDetail from '@/views/Detail/PaperDetail'
import DatasetDetail from '@/views/Detail/DatasetDetail'
import NoteDetail from '@/views/Detail/NoteDetail'

import PostPaper from '@/views/Post/PostPaper'
import PostDataset from '@/views/Post/PostDataset'
import PostNote from '@/views/Post/PostNote'

import UserManage from '@/views/SystemSetting/UserManage'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Main',
        component: Main,
        redirect: '/login',
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
                path: 'paperList',
                name: 'paperList',
                component: PaperList,
                meta: {
                    login: true
                }
            },
            {
                path: 'datasetList',
                name: 'datasetList',
                component: DatasetList,
                meta: {
                    login: true
                }
            },
            {
                path: 'paperDetail',
                name: 'paperDetail',
                component: PaperDetail
            }, {
                path: 'datasetDetail',
                name: 'datasetDetail',
                component: DatasetDetail
            },
            {
                path: 'noteDetail',
                name: 'noteDetail',
                component: NoteDetail
            },
            {
                path: 'postPaper',
                name: 'postPaper',
                component: PostPaper
            }, {
                path: 'postDataset',
                name: 'postDataset',
                component: PostDataset
            },
            {
                path: 'postNote',
                name: 'postNote',
                component: PostNote
            },
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
    mode: 'history',
    routes
})

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

export default router