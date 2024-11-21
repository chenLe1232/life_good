import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import './styles/index.css';
import './styles/loading.css';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.mount('#app');