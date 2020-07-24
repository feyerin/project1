import Vue from "vue";
import VueRouter from "vue-router";
import AuthRequired from "./utils/AuthRequired";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "app" */ './views/app'),
    redirect: '/app/dashboards',
    beforeEnter: AuthRequired,
    children: [
      {
        path: 'app/dashboards',
        component: () => import(/* webpackChunkName: "piaf" */ './views/app/dashboards'),
        redirect: '/app/dashboards/start',
        children: [
          { path: 'start', component: () => import(/* webpackChunkName: "piaf" */ './views/app/dashboards/Start') }
        ]
      },
      {
        path: 'app/merchant',
        component: () => import('./views/app/merchant'),
        redirect: '/app/merchant/approval',
        children: [
          { path: 'approval-merchant', component: () => import('./views/app/merchant/approval') },
          { path: 'merchant', component: () => import('./views/app/merchant/merchant') },
          { path: 'merchant-non-pkp', component: () => import('./views/app/merchant/merchantNonPKP') },          
          { path: 'history-order-merchant', name:'historyOrder', component: () => import('./views/app/merchant/historyOrder') },
          { path: 'input-merchant', component: () => import('./views/app/merchant/input')},
          { path: 'detail-owner', name:'detailOwner', component: () => import('./views/app/merchant/detailOwner') },
        ]
      },
      {
        path: 'app/driver',
        component: () => import('./views/app/driver'),
        redirect: '/app/driver/driver',
        beforeEnter: AuthRequired,
        children: [
          {path:'driver-merchant',  component: () => import('./views/app/driver/driver')}
        ]
      },
      {
        path: 'app/sembako',
        component: () => import('./views/app/sembako'),
        redirect: '/app/sembako/driver/dedicatedDriver',
        beforeEnter: AuthRequired,
        children: [
          {path:'dedicated-driver', component: () => import('./views/app/sembako/driver/dedicatedDriver')},
          {path:'driver-profile', name:'detailDriver', component: () => import('./views/app/sembako/driver/driverProfile')},
        ]
      },
      {
        path: "app/sembako",
        component: () => import( "./views/app/sembako"),
        redirect: "/app/sembako/market/market",
        beforeEnter: AuthRequired,
        children: [
          { path: "list-market", component: () => import( "./views/app/sembako/market/market")},
          { path: "detail-market", name:'detailMarket', component: () => import( "./views/app/sembako/market/detailMarket")},
        ]
      },
      {
        path: "app/sembako",
        component: () => import( "./views/app/sembako"),
        redirect: "/app/sembako/order/incomingOrder",
        beforeEnter: AuthRequired,
        children: [
          { path: "incoming-order", component: () => import( "./views/app/sembako/order/incomingOrder")},
        ]
      },
      {
        path: "app/sembako",
        component: () => import( "./views/app/sembako"),
        redirect: "/app/sembako/monitoring/monitoringOrder",
        beforeEnter: AuthRequired,
        children: [
          { path: "monitoring-order", component: () => import( "./views/app/sembako/monitoring/monitoringOrder")},
        ]
      },
    ]
  },

  {
    path: '/user',
    component: () => import( './views/user'),
    redirect: '/user/login',
    children: [
      { path: 'login', component: () => import( './views/user/Login') },
      { path: 'register', component: () => import('./views/user/Register') },
      { path: 'forgot-password', component: () => import('./views/user/ForgotPassword') }
    ]
  },
  { path: '*', component: () => import('./views/Error') }
]

const router = new VueRouter({
  linkActiveClass: "active",
  routes,
  mode: "history"
});

export default router;
