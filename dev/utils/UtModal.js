import Vue from 'vue';
import {UtSequence} from "./UtSequence";

export const UtModal = {
    showModal(modalClass, config = {}) {
        let CompClone = Vue.extend(modalClass);
        let modalId = UtSequence.getCompId();
        let propsData = Object.assign({
            id: modalId
        }, config.propsData ? config.propsData : {});
        let modalCfg = Object.assign({
            onOk() {
            },
            onAfterOk() {
            },
            onCancel() {
            },
            onError() {
            }
        }, config);
        modalCfg.propsData = propsData;

        let methods = {}
        if (config.onOk) {
            methods.onOk = modalCfg.onOk;
        }
        if (config.onAfterOk) {
            methods.onAfterOk = modalCfg.onAfterOk;
        }
        if (config.onCancel) {
            methods.onCancel = modalCfg.onCancel;
        }
        if(config.onClose) {
            methods.onClose = modalCfg.onClose
        }
        if (config.onError) {
            methods.onError = modalCfg.onError;
        }

        const modalContainer = document.createElement('div')
        document.getElementById('app').appendChild(modalContainer);

        let comp = new CompClone({
            propsData: modalCfg.propsData,
            mounted() {
                const th = this;
                th.$bvModal.show(propsData.id);
            },
            methods: methods
        }).$mount(modalContainer);
    },
    closeModal(modal) {
        modal.$nextTick(() => {
            modal.$bvModal.hide(modal.id);
        });
    }
};
