import Vue from 'vue';
import Router from 'vue-router';
import Desktop from '@/views/Desktop.vue';
import Login from '@/views/Login.vue';
import Home from '@/views/Home.vue';
import Chat from '@/views/Chat.vue';
import Chat_Self from '@/views/Chat_Self.vue';
import Chat_Slackbot from '@/views/Chat_Slackbot.vue';
import Chat_Members from '@/views/Chat_Members.vue';
import Readme from '@/views/Readme.vue';
import store from './vuex/store';
import firebaseAuth from "@/firebase/firebaseAuth";


Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Desktop',
      component: Desktop
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/chat',
      component: Chat,
      children: [
        {
          path: 'self',
          name: 'Chat_Self',
          component: Chat_Self
        },
        {
          path: 'slackbot',
          name: 'Chat_Slackbot',
          component: Chat_Slackbot
        },
        {
          path: ':name',
          name: 'Chat_Members',
          component: Chat_Members,
          props: true
        },
      ]
    },
    {
      path: '/readme',
      name: 'readme',
      component: Readme
    },
    {
      path: '*',
      redirect: '/'
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
});

router.beforeEach((to, from, next) => {
  firebaseAuth.onAuthStateChanged(user => {
    if (to.fullPath === '/home') {
      if (!user) {
        next('/login');
      }
    }
    if (to.fullPath.slice(0, 6) === '/chat/') {
      if (!user) {
        next('/login');
      }
    }
    next();
  });
});

export default router;