import { defineStore } from 'pinia';
import { login } from '../managers/ApiManager';

export const useStoreUser = defineStore('user', {
    state: () => ({
        name: '',
    }),
    getters: {},
    actions: {
        async login() {
            return login();
        },
    },
})