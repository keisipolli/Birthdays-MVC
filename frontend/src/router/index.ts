import {createRouter, createWebHistory} from 'vue-router';

// Import your components here
// @ts-ignore
import SignUp from '../views/SignUp.vue';
import SignIn from '../views/SignIn.vue';
import BirthdayBook from '../views/BirthdayBook.vue';
import Calendar from '../views/Calendar.vue';

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
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
