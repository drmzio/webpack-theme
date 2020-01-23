__webpack_public_path__ = window.resourceBasePath;

// Theme by default loads a jQuery as dependency of the main script.
// Let's include it using ES6 modules import.
//import $ from 'jquery'
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
    { path: '/foo', component: () => import(/* webpackChunkName: "pages" */ './Foo') },
    { path: '/bar', component: () => import(/* webpackChunkName: "pages" */ './Bar') }
];

const router = new VueRouter({
    routes // short for `routes: routes`
});

const app = new Vue({
    router,
}).$mount('#app');
