import 'primevue/resources/primevue.min.css';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';

import './assets/styles/layout.scss';

import {createApp, reactive} from 'vue';
import router from './router';
import App from './App.vue';

import {prime} from "./auxiliary/components/prime";


const app = createApp(App);

app.config.globalProperties.$appState = reactive({theme: 'saga-blue'});

app.use(router);

prime(app);


app.mount('#app');