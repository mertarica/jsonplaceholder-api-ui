import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from '@/App.vue';
import router from './router';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import { VueQueryPlugin } from '@tanstack/vue-query';

// PrimeVue Components
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import ProgressSpinner from 'primevue/progressspinner';
import Message from 'primevue/message';

import ErrorBoundary from '@/components/ErrorBoundary.vue';

import '@/assets/main.css';
import 'primeicons/primeicons.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: false
    }
  }
});
app.use(VueQueryPlugin);

app.component('Avatar', Avatar);
app.component('Button', Button);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Card', Card);
app.component('InputText', InputText);
app.component('Textarea', Textarea);
app.component('ProgressSpinner', ProgressSpinner);
app.component('Message', Message);

app.component('ErrorBoundary', ErrorBoundary);

app.mount('#app');