import {createRouter, createWebHistory} from 'vue-router';

// Import your components here
// @ts-ignore
import SignUp from '../views/SignUp.vue';
import SignIn from '../views/SignIn.vue';
import BirthdayBook from '../views/BirthdayBook.vue';
import TermsPolicies from '../views/TermsPolicies.vue';

const routes = [

    {
        path: '/',
        name: 'Friends birthday book',
        component: BirthdayBook,
    },
    {
        path: '/signup',
        name: 'Sign Up',
        component: SignUp,
    },
    {
        path: '/signin',
        name: 'Sign In',
        component: SignIn,
    },
    {
        path: '/terms',
        name: 'Terms & Policies',
        component: TermsPolicies,
    },
    {
        path: '/content',
        name: 'Content',
        component: () => import('../views/Content.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});
export default router;
