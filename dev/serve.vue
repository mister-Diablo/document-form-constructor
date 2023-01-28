<template>
    <div id="app">
        <div class="app-toolbar">
            <b-button type="button" variant="secondary" @click="showDocForm">
                DocForm
            </b-button>
        </div>
        <doc-template-constructor :form-config="formConfig" :facets="facets"></doc-template-constructor>
    </div>
</template>

<script>
    import Vue from 'vue';
    import DocTemplateConstructor from "../src/components/DocTemplateConstructor";
    import DocFormFrame from "./frame/DocFormFrame";
    import {UtModal} from "./utils/UtModal";


    export default Vue.extend({
        name: 'ServeDev',
        components: {
            DocTemplateConstructor,
        },
        data() {
            return {
                formConfig: {sections: []},
                // for debugging
                // {"sections":[{"labelRu":null,"columnCount":1,"columns":[{"index":0,"fields":[{"name":"defectedActNumber","facet":1,"type":"integer","labelRu":"№ дефектного акта","tag":"${defectedActNumber}","multiple":false,"visible":true,"editable":true,"required":true,"input":{"text":"Число","name":"number","type":"b-form-input","props":{"placeholder":{"type":"string","default":null,"label":"Надпись внутри","visible":true},"type":{"type":"string","default":"number","label":"Тип данных","visible":false},"min":{"type":"number","default":null,"label":"Минимальное значение","visible":true}},"propsData":{"placeholder":null,"type":"number","min":"10","ref":"defectedActNumber"},"defaultValue":null},"defaultValue":null}]}]}]}
                facets: [
                    {
                        id: 1,
                        name: 'supplyInfo',
                        labelRu: 'Данные актов',
                        expanded: true,
                        fields: [
                            {
                                name: 'defectedActNumber',
                                facet: 1,
                                type: 'integer',
                                labelRu: '№ дефектного акта',
                                tag: '${defectedActNumber}',
                                multiple: false,
                                visible: true,
                                editable: true,
                                required: false,
                            },
                            {
                                name: 'testData',
                                facet: 1,
                                type: 'date',
                                labelRu: 'test date',
                                tag: '${testDate}',
                                multiple: false,
                                visible: true,
                                editable: true,
                                required: false,
                            },
                            {
                                name: 'defectedActNumberString',
                                facet: 1,
                                type: 'string',
                                labelRu: '№ дефектного акта прописью',
                                tag: '${defectedActNumberString}',
                                multiple: false,
                                visible: true,
                                editable: true,
                                required: false,
                            },
                            {
                                name: 'defectedActDt',
                                facet: 1,
                                type: 'date',
                                labelRu: 'Дефектный акт на',
                                tag: '${defectedActDt}',
                                multiple: false,
                                visible: true,
                                editable: true,
                                required: false,
                            },
                            {
                                name: 'signerId',
                                facet: 1,
                                type: 'long',
                                labelRu: 'Подписант',
                                ref: 'usr',
                                tag: '${signerId}',
                                multiple: false,
                                visible: true,
                                editable: true,
                                required: false,
                            },
                            {
                                name: 'boombaDt',
                                facet: 1,
                                type: 'date',
                                labelRu: 'Это бумба',
                                tag: '${boombaDt}',
                                multiple: false,
                                visible: true,
                                editable: true,
                                required: false,
                                hiddenOnFormConfig: true,
                            },
                            {
                                dict: false,
                                editable: true,
                                facet: 1,
                                hiddenOnFormConfig: false,
                                id: 19,
                                labelEn: null,
                                labelKz: null,
                                labelRu: "Ожидание ответа",
                                multiple: false,
                                name: "incomeData:responseWait",
                                ref: "",
                                required: false,
                                tag: "${incomeData:responseWait}",
                                type: "boolean",
                                visible: true,
                            }
                        ]
                    },
                    {
                        id: 2,
                        name: 'Other info',
                        labelRu: 'Другая информация',
                        expanded: true,
                        fields: []
                    },
                    {
                        id: 3,
                        name: 'Hidden info',
                        labelRu: 'Скрытая информация',
                        expanded: true,
                        fields: [
                            {
                                name: 'tomoriDt',
                                facet: 3,
                                type: 'date',
                                labelRu: 'Это Томори',
                                tag: '${tomoriDt}',
                                multiple: false,
                                visible: true,
                                editable: true,
                                required: false,
                                hiddenOnFormConfig: true,
                            },
                        ]
                    },
                ]
            }
        },
        methods: {
            showDocForm() {
                UtModal.showModal(DocFormFrame, {
                    propsData: {
                        formConfig: this.formConfig,
                    }
                });
            },
        },
        created() {

        }
    });
</script>

<style>
    #app .rb-doc-template-constructor {
        height: 100vh;
        overflow: hidden;
    }
</style>
