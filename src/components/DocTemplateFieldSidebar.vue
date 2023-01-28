<template>
    <b-sidebar right class="rb-doc-template-field-sidebar" bg-variant="white" shadow
               v-model="innerVisible">
        <template #header>
            <b-button class="rb-sidebar-close-btn" variant="secondary" @click="hide">
                <rb-icon :icon="innerVisible? iconCloseSidebar: iconOpenSidebar"></rb-icon>
            </b-button>
            <h4>Редактор свойств</h4>
        </template>

        <b-form v-if="field">
            <div class="rb-form-section">
                <b-form-row>
                    <b-col lg="12">
                        <b-form-group label="Название" class="rb-immutable">
                            <rb-text>{{field.name}}</rb-text>
                        </b-form-group>
                    </b-col>
                </b-form-row>
                <b-form-row>
                    <b-col lg="12">
                        <b-form-group label="Тип" class="rb-immutable">
                            <rb-text>{{field.type}}</rb-text>
                        </b-form-group>
                    </b-col>
                </b-form-row>
                <b-form-row>
                    <b-col lg="12">
                        <b-form-group label="Тэг для файла шаблона" class="rb-immutable">
                            <rb-text>{{field.tag}}</rb-text>
                        </b-form-group>
                    </b-col>
                </b-form-row>
                <b-form-row>
                    <b-col lg="12">
                        <b-form-group label="Заголовок">
                            <b-form-input v-model="field.labelRu"></b-form-input>
                        </b-form-group>
                    </b-col>
                </b-form-row>
<!--                <b-form-row>-->
<!--                    <b-col lg="12">-->
<!--                        <b-checkbox size="lg" v-model="field.multiple" :disabled="!hasMultipleInputTypes">-->
<!--                            Множественное-->
<!--                        </b-checkbox>-->
<!--                    </b-col>-->
<!--                </b-form-row>-->
                <b-form-row>
                    <b-col lg="12">
                        <b-checkbox size="lg" v-model="field.visible">Отображаемое</b-checkbox>
                    </b-col>
                </b-form-row>
                <b-form-row>
                    <b-col lg="12">
                        <b-checkbox size="lg" v-model="field.editable">Редактируемое</b-checkbox>
                    </b-col>
                </b-form-row>
                <b-form-row>
                    <b-col lg="12">
                        <b-checkbox size="lg" v-model="field.required">Обязательное</b-checkbox>
                    </b-col>
                </b-form-row>
            </div>
            <div class="rb-form-section">
                <div class="rb-title">
                    Настройки ввода
                </div>

                <b-form-row>
                    <b-col lg="12">
                        <b-form-group label="Тип инпута">
                            <rb-dropdown-input v-model="currentInputName"
                                               :items="inputOptions"
                                               display-field="text"
                                               value-field="name"
                                               block>
                            </rb-dropdown-input>
                        </b-form-group>

                        <template v-for="(prop, propName) in field.input.props">
                            <b-form-group :label="prop.label" :key="propName" v-if="prop.visible">
                                <component v-bind:is="getPropInputType(prop, propName)"
                                           v-model="field.input.propsData[propName]"
                                           v-bind="getPropInputPropData(prop, propName)"></component>
                            </b-form-group>
                        </template>
                    </b-col>
                </b-form-row>
            </div>

            <div class="rb-form-section" v-if="field.input">
                <div class="rb-title">Значение по-умолчанию</div>

                <b-form-row>
                    <b-col lg="12">
                        <b-form-group :label="field.labelRu" ref="inputContainer">
                            <component v-bind:is="field.input.type"
                                       v-model="field.defaultValue"
                                       v-bind="field.input.propsData"></component>
                        </b-form-group>
                    </b-col>
                </b-form-row>
            </div>

            <div class="rb-form-section">
                <div class="rb-title">Правила</div>

                <b-list-group :data-hash="rulesHash">
                    <b-list-group-item v-for="rule in field.rules"
                                       @click="editRule(rule, $event)"
                                       :key="rule.id"
                                       :data-hash="rulesHash"
                                       class="cursor-pointer d-flex justify-content-between align-items-center">
                        <rb-text>{{rule.name}}</rb-text>
                        <rb-icon icon="icon-close" class="rb-remove-rule" @click="removeRule(rule)"></rb-icon>
                    </b-list-group-item>
                    <b-list-group-item @click="addRule" class="cursor-pointer">
                        <rb-icon :icon="iconAdd"></rb-icon>
                        <rb-text>Добавить правило ...</rb-text>
                    </b-list-group-item>
                </b-list-group>
            </div>
        </b-form>

        <field-rule-form-modal :rule="ruleModalCfg.rule"
                               :form-config="formConfig"
                               :field="field"
                               :mode="ruleModalCfg.mode"
                               :on-after-ok="ruleModalCfg.onAfterOk"
        ></field-rule-form-modal>
    </b-sidebar>
</template>

<script>
    import FieldRuleFormModal from "./FieldRuleFormModal";
    import {v4 as uuidv4} from 'uuid';
    import {UtFormConstructor} from "../utils/UtFormConstructor";

    export default {
        name: 'DocTemplateFieldSidebar',
        components: {FieldRuleFormModal},
        props: {
            value: {
                type: Object,
                default: null
            },
            visible: {
                type: Boolean,
                default: null,
            },
            formConfig: Object,
        },
        data() {
            return {
                innerVisible: null,
                field: null,
                currentInputName: null,
                modalId: 'rb-field-rule-form-modal',
                ruleModalCfg: {
                    rule: {},
                    mode: 'ins',
                },
                rulesHash: uuidv4(),
            }
        },
        computed: {
            inputOptions() {
                return this.field ? UtFormConstructor.getInputTypes(this.field) : [];
            },
            iconCloseSidebar() {
                return UtFormConstructor.config.icons.iconCloseFieldSidebar;
            },
            iconOpenSidebar() {
                return UtFormConstructor.config.icons.iconOpenFieldSidebar;
            },
            iconAdd() {
                return UtFormConstructor.config.icons.iconAdd;
            },
            rules() {
                return UtFormConstructor.getAvailableFieldRules(this.field);
            },
            hasMultipleInputTypes() {
                return UtFormConstructor.hasMultipleInputTypes(this.field);
            },
            multiple() {
                return this.field && this.field.multiple;
            }
        },
        watch: {
            visible() {
                this.innerVisible = this.visible;
            },
            value() {
                this.field = this.value;
                if (this.field && this.field.input) {
                    this.currentInputName = this.field.input.name;
                }
            },
            field: {
                handler() {
                    this.$emit('input', this.field);
                    this.$emit('change', this.field);
                },
                deep: true
            },
            currentInputName(val) {
                this.field.input = UtFormConstructor.getInputTypeByName(this.currentInputName, this.field);
            },
            multiple() {
                let input = UtFormConstructor.getDefaultInput(this.field);
                if (this.field.multiple) {
                    this.currentInputName = input.name;
                }
            },
        },
        methods: {
            hide() {
                this.innerVisible = false;
                this.$emit('hide');
            },
            getPropInputType(prop, propName) {
                if (['string', 'number'].includes(prop.type)) {
                    return 'b-form-input';
                } else if (['date'].includes(prop.type)){
                    return 'rb-date-picker-input';
                } else {
                    return 'rb-boolean-single-option-input';
                }
            },
            getPropInputPropData(prop, propName) {
                if (prop.type === 'string') {
                    return {
                        type: 'text',
                    }
                } else if (prop.type === 'number'){
                    return {
                        type: 'number'
                    }
                } else {
                    return {}
                }
            },
            addRule() {
                this.ruleModalCfg = {
                    mode: 'ins',
                    rule: {
                        name: null,
                        script: null,
                    },
                    onAfterOk: (rule) => {
                        this.field.rules = this.field.rules ? this.field.rules : [];
                        this.field.rules.push({
                            ...rule
                        });
                        this.rulesHash = uuidv4();
                    }
                }
                this.$bvModal.show(this.modalId);
            },
            editRule(rule, event) {
                if (event.target.classList
                    && event.target.classList.contains('rb-remove-rule')) {
                    return;
                }

                this.ruleModalCfg = {
                    mode: 'upd',
                    rule: {...rule},
                    onAfterOk: (modalRule) => {
                        Object.assign(rule, modalRule)
                    }
                }
                this.$bvModal.show(this.modalId);
            },
            removeRule(rule) {
                let index = this.field.rules.findIndex(r => r.id === rule.id);
                if (index >= 0) {
                    this.field.rules.splice(index, 1);
                }
                this.rulesHash = uuidv4();
            }
        },
    created() {
        if (this.value) {
                this.innerVisible = this.visible;
                this.field = this.value;
                if (this.field && this.field.input) {
                    this.currentInputName = this.field.input.name;
                }
            }
        }
    }
</script>
