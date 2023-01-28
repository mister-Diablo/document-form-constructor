<template>
    <b-modal :id="id"
             :title="title"
             modal-class="rb-field-rule-form-modal"
             size="lg"
             @ok.prevent="onOk"
             ok-title="Сохранить правило"
             cancel-variant="outline-gray"
             cancel-title="Отмена">
        <b-card no-body>
            <b-tabs card @activate-tab="onActivateTab">
                <b-tab title="Правило" active>
                    <b-form v-if="innerRule">
                        <b-form-row>
                            <b-col log="12">
                                <b-form-group label="Выбрать" v-if="rulePresets.length > 0">
                                    <template #description>
                                        Выберите готовое правило из списка и если нужно, измените
                                    </template>
                                    <b-form-select @input="onRuleSelected($event)">
                                        <b-form-select-option v-for="r in rulePresets" :key="r.name"
                                                              :value="r.name">
                                            {{r.labelRu}} ({{r.name}})
                                        </b-form-select-option>
                                    </b-form-select>
                                </b-form-group>
                            </b-col>
                            <b-col lg="12">
                                <b-form-group label="Название">
                                    <template #description>
                                        Задайте уникальное название, чтобы отличать правило в списке
                                    </template>
                                    <b-form-input v-model="innerRule.name"
                                                  :state="state.name"
                                                  :invalid-feedback="state.name_feedback"
                                    ></b-form-input>
                                </b-form-group>
                            </b-col>
                            <b-col lg="12">
                                <b-form-group label="Событие">
                                    <template #description>
                                        При возникновении этого события будет выполняться правило
                                    </template>
                                    <b-form-select v-model="innerRule.event"
                                                   :state="state.event"
                                                   :invalid-feedback="state.event_feedback">
                                        <b-form-select-option :value="'input'">
                                            Ввод значения
                                        </b-form-select-option>
                                        <b-form-select-option :value="'change'">
                                            Изменение значения
                                        </b-form-select-option>
                                        <b-form-select-option :value="'click'">
                                            Клик
                                        </b-form-select-option>
                                        <b-form-select-option :value="'validate'">
                                            Валидация
                                        </b-form-select-option>
                                        <b-form-select-option :value="'defaultValue'">
                                            Установить значение по умолчанию
                                        </b-form-select-option>
                                    </b-form-select>
                                </b-form-group>
                            </b-col>
                            <b-col lg="12">
                                <b-form-group label="Скрипт">
                                    <template #description>
                                        Здесь указывается скрипт правила. Скрипт должен быть написан на языке
                                        javascript
                                    </template>
                                    <div class="rb-script-input">
                                        <b-button-toolbar>
                                            <b-dropdown text="Переменные" variant="outline-secondary"
                                                        size="sm" class="mx-1">
                                                <b-dropdown-item @click="addVariableToScript('doc')">
                                                    Документ
                                                </b-dropdown-item>
                                                <b-dropdown-item @click="addVariableToScript('form')">
                                                    Форма
                                                </b-dropdown-item>
                                                <b-dropdown-item @click="addVariableToScript('event')">
                                                    Значение события
                                                </b-dropdown-item>
                                            </b-dropdown>
                                            <b-dropdown text="Задать значение" variant="outline-secondary"
                                                        size="sm" class="mx-1">
                                                <b-dropdown-item v-for="f in fields" :key="f.name"
                                                                 v-if="fields" @click="addSetVariableToScript(f)">
                                                    {{f.labelRu}} ({{f.name}})
                                                </b-dropdown-item>
                                            </b-dropdown>
                                            <b-dropdown text="Вызвать функцию инпута" variant="outline-secondary"
                                                        size="sm" class="mx-1">
                                                <b-dropdown-item v-for="f in fields" :key="f.name"
                                                                 v-if="fields" @click="addCallInputFunction(f)">
                                                    {{f.labelRu}} ({{f.name}})
                                                </b-dropdown-item>
                                            </b-dropdown>
                                        </b-button-toolbar>
                                        <b-form-textarea v-model="innerRule.script"
                                                         :state="state.script"
                                                         :invalid-feedback="state.script_feedback"
                                                         rows="8"
                                                         ref="scriptInput"
                                        ></b-form-textarea>
                                    </div>
                                </b-form-group>
                            </b-col>
                        </b-form-row>
                    </b-form>
                </b-tab>
                <b-tab title="Протестировать правило" v-if="innerFormConfig">
                    <doc-form :form-config="innerFormConfig">
                    </doc-form>
                </b-tab>
            </b-tabs>
        </b-card>
    </b-modal>
</template>

<script>
    import {UtFormConfig} from "../utils/UtFormConfig";
    import {v4 as uuidv4} from 'uuid';
    import {UtFormConstructor} from "../utils/UtFormConstructor";
    import DocForm from "./DocForm";

    export default {
        name: 'FieldRuleFormModal',
        components: {DocForm},
        props: {
            field: Object,
            rule: Object,
            formConfig: Object,
            mode: {type: String, default: 'ins'},
            onAfterOk: Function,
        },
        data() {
            return {
                id: 'rb-field-rule-form-modal',
                state: this.getDefaultState(),
                innerFormConfig: null,
                innerRule: null,
            }
        },
        computed: {
            title() {
                return this.mode === 'ins' ? 'Добавление правила' : 'Редактирование правила';
            },
            fields() {
                return UtFormConfig.getFields(this.formConfig);
            },
            rulePresets() {
                return UtFormConstructor.getAvailableFieldRules(this.field);
            }
        },
        watch: {
            formConfig() {
                this.copyToInnerFormConfig();
            },
            rule() {
                if (this.rule) {
                    this.innerRule = this.rule;
                } else {
                    this.innerRule = this.getDefaultRule();
                }

            }
        },
        methods: {
            validateFields(fieldName) {
                let fields = fieldName ? [fieldName] : ['name', 'event', 'script'];
                fields.forEach(field => {
                    if (!this.innerRule[field]) {
                        this.state[field] = false;
                        this.state[`${field}_feedback`] = 'Заполните название';
                    } else {
                        this.state[field] = true;
                        this.state[`${field}_feedback`] = null;
                    }
                });
            },
            copyToInnerFormConfig() {
                this.innerFormConfig = JSON.parse(JSON.stringify(this.formConfig));
            },
            applyRuleToInnerFormConfig() {
                if (this.innerFormConfig) {
                    let foundRule = UtFormConfig.findRule(this.innerRule.id, this.innerFormConfig);

                    if (!foundRule) {
                        let foundField = UtFormConfig.findField(
                            this.field.name, this.innerFormConfig
                        );

                        if (foundField) {
                            foundField.rules = foundField.rules ? foundField.rules : [];
                            foundField.rules.push(this.rule);
                        }
                    } else {
                        Object.assign(foundRule, this.innerRule);
                    }
                }
            },
            onActivateTab(index) {
                if (index > 0) {
                    this.copyToInnerFormConfig();
                    this.applyRuleToInnerFormConfig();
                }
            },
            getDefaultState() {
                return {
                    name: null,
                    event: null,
                    script: null,
                }
            },
            getDefaultRule() {
                return {
                    id: uuidv4(),
                    name: null,
                    event: null,
                    script: null,
                }
            },
            resetModal() {
                this.state = this.getDefaultState();
                this.innerRule = null;
            },
            addVariableToScript(varName) {
                let caretPosition = this.$refs.scriptInput.selectionStart;
                this.insertTextToScript(varName, caretPosition);
            },
            addSetVariableToScript(field) {
                let caretPosition = this.$refs.scriptInput.selectionStart;
                this.insertTextToScript(`doc['${field.name}'] = Значение;`, caretPosition);
            },
            addCallInputFunction(field) {
                let caretPosition = this.$refs.scriptInput.selectionStart;
                this.insertTextToScript(`form.$refs['${field.name}'][0].Название функции();`, caretPosition);
            },
            insertTextToScript(text, position) {
                position = position != null? position: this.script.length;
                this.innerRule.script = this.innerRule.script != null? this.innerRule.script: '';
                let scriptSplit = this.innerRule.script.split('');
                scriptSplit.splice(position, 0, text);
                this.innerRule.script = scriptSplit.join('');
            },
            onRuleSelected(ruleName) {
                let rule = this.rulePresets.find(rule => rule.name === ruleName);
                if(rule) {
                    Object.assign(this.innerRule, rule);
                    this.innerRule.script = this.innerRule.script.trim();
                }
            },
            onOk() {
                this.validateFields();

                if (this.state.name && this.state.script) {
                    if (this.onAfterOk) {
                        this.onAfterOk(this.innerRule);
                    }
                    this.$nextTick(() => {
                        this.resetModal();
                        this.$bvModal.hide(this.id);
                    });
                }
            }
        },
        created() {
            this.copyToInnerFormConfig();
        }
    }
</script>
