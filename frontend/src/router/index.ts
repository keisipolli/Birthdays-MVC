import {createRouter, createWebHistory} from 'vue-router';

// Import your components here
// @ts-ignore
import SignUp from '../views/SignUp.vue';
import SignIn from '../views/SignIn.vue';
import BirthdayBook from '../views/BirthdayBook.vue';
import TermsPolicies from '../views/TermsPolicies.vue';
import Birthdays from '../views/Birthdays.vue';
import Log from '../views/Log.vue';

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
        path: '/birthdays',
        name: 'Birthdays',
        component: Birthdays,
    },
    {
        path: '/log',
        name: 'Log',
        component: Log,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});
export default router;