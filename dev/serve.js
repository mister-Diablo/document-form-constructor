import Vue from 'vue';
import Dev from './serve.vue';
import './serve.scss';
import RbDocumentFormConstructor from '@/entry.esm';
import RbBvComponents from 'rb-bv-components';
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue';
import {formConstructorConfig} from "./config/formConstructor";
import {UtFormConfig} from "../src/utils/UtFormConfig";
import {UtFormConstructor} from "../src/utils/UtFormConstructor";


Vue.use(RbDocumentFormConstructor);
Vue.use(RbBvComponents);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.config.productionTip = false;

UtFormConstructor.init(formConstructorConfig);

new Vue({
  render: (h) => h(Dev),
}).$mount('#app');
