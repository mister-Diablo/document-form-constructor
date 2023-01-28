<template>
    <b-form v-if="formConfig" class="rb-doc-form">
        <b-container v-if="formConfig && formConfig.sections"
                     v-for="(section) in formConfig.sections"
                     :key="section.labelRu"

                     class="rb-form-section">
            <b-row>
                <b-col lg="12">
                    <h4>{{ section.labelRu }}</h4>
                </b-col>
                <template v-for="column in section.columns">
                    <b-col :key="column.index" :lg="getColumnSize(section)" :sm="12">
                        <template v-for="field in column.fields">
                            {{field.valueName}}
                            <b-form-row :key="field.name" v-if="field.visible">
                                <b-col lg="12">
                                    <b-form-group :state="validationState[field.name]"
                                                  :invalid-feedback="validationState[`${field.name}__feedback`]"
                                                  ref="inputContainer">
                                        <component v-bind:is="field.input.type"
                                                   v-model="doc[field.name]"
                                                   :resolve-value="getResolveValue(field)"
                                                   :disabled="!editable || !field.editable"
                                                   :id="field.name"
                                                   :state="validationState[field.name]"
                                                   :ref="field.name"
                                                   :required="field.required"
                                                   @input="onEventFired('input', $event, field)"
                                                   @change="onEventFired('change', $event, field)"
                                                   @click="onEventFired('click', $event, field)"
                                                   @set-resolve-value="setResolveValue"
                                                   v-bind="field.input.propsData"></component>
                                        <template #label>
                                            <span :title="field.labelRu">{{ field.labelRu }}</span>
                                            <span v-if="showRequiredInLabel && field.required"
                                                  class="text-danger">*</span>
                                        </template>
                                    </b-form-group>
                                </b-col>
                            </b-form-row>
                        </template>
                    </b-col>

                </template>
            </b-row>
        </b-container>
    </b-form>
</template>

<script>
import Vue from 'vue';
import {UtFormConstructor} from "../utils/UtFormConstructor";
import typeOf from 'typeof';
// import safeEval from "notevil";

export default {
    name: 'DocForm',
    props: {
        formConfig: Object,
        applyDefaultValues: {type: Boolean, default: true},
        doc: {type: Object, default: () => ({})},
        refSuffix: {type: String, default: 'Id'},
        editable: {type: Boolean, default: true},
        showRequiredInLabel: {type: Boolean, default: true},
    },
    data() {
        return {
            validationState: {}
        }
    },
    watch: {
        formConfig() {
            this.validationState = {};
            this.execApplyDefaultValues();
            this.execApplyDefaultValRule();
        }
    },
    methods: {
        getResolveValueName(field) {
            if ((field.dict || field.ref) && !field.multiple) {
                return field.name.substring(0, field.name.length - 2)
            }
            return field.name
        },
        getResolveValue(field) {
            return this.doc[this.getResolveValueName(field)] ? this.doc[this.getResolveValueName(field)] : null
        },
        setResolveValue({field, multiple = false}) {
            let resolveValue = this.getResolveValue(field);
            if (resolveValue && !multiple) {
                resolveValue = null
            }
        },
        onEventFired(eventName, event, field) {
            if (eventName === 'input' && field.ref && !field.multiple) {
                let dataField = null;
                if (field.name.lastIndexOf(this.refSuffix) >= 0) {
                    dataField = field.name.substring(0, field.name.lastIndexOf(this.refSuffix));
                }

                if (dataField && dataField.length > 0) {
                    this.doc[dataField] = null;
                }
            }

            if (field.rules) {
                field.rules.forEach(rule => {
                    if (rule.event === eventName && rule.script) {
                        let ruleContext = UtFormConstructor.getRuleContext();
                        ruleContext.form = this;
                        ruleContext.doc = this.doc;
                        ruleContext.event = event;
                        ruleContext.eventName = eventName;
                        UtFormConstructor.runRule(ruleContext, rule.script);
                    }
                })
            }
        },
        isValueEmpty(fieldName) {
            if (this.doc[fieldName] == null) {
                return true;
            }

            if (typeOf(this.doc[fieldName] === 'string') && this.doc[fieldName] === '') {
                return true;
            }
            return false;
        },
        isValueLessThanMin(fieldname, min) {
            if (this.doc[fieldname] && min) {
                return parseInt(this.doc[fieldname]) < parseInt(min)
            }

            return false;
        },
        validate() {
            this.formConfig.sections.forEach(s => {
                s.columns.forEach(c => {
                    c.fields.forEach(f => {
                        let feedback = '';

                        if (f.required && this.isValueEmpty(f.name)) {
                            feedback += `Поле "${f.labelRu}" обязательно`
                        }

                        if (f.type === 'integer' && this.isValueLessThanMin(f.name, f.input.propsData.min)) {
                            feedback += `\nМинимальное значение для этого поля ${f.input.propsData.min}`;
                        }

                        if (feedback) {
                            Vue.set(this.validationState, f.name, false)
                            Vue.set(this.validationState, `${f.name}__feedback`, feedback);
                        } else {
                            Vue.set(this.validationState, f.name, null);
                        }

                        this.onEventFired('validate', {
                            validationState: this.validationState,
                            doc: this.doc,
                        }, f);
                    })
                })
            });
            for (let fieldName in this.validationState) {
                if (this.validationState[fieldName] === false) {
                    return false;
                }
            }

            return true;
        },
        getColumnSize(section) {
            const MAX_COLUMN_SIZE = 12;
            if (!section || !section.columnCount) {
                return MAX_COLUMN_SIZE;
            }

            let colSize = Math.floor(MAX_COLUMN_SIZE / section.columnCount);
            return colSize;
        },
        execApplyDefaultValues() {
            if (this.applyDefaultValues) {
                this.formConfig.sections.forEach(r => {
                    r.columns.forEach(c => {
                        c.fields.forEach(f => {
                              if (f.defaultValue) {
                            let defValue;
                            if (this.defaultValue && typeOf(f.defaultValue) === 'function') {
                                defValue = f.defaultValue();
                            } else {
                                defValue = f.defaultValue == null ? null : f.defaultValue;
                            }

                            this.$set(
                                this.doc,
                                f.name,
                                f.defaultValue = defValue
                            );
                              }
                        })
                    });
                });
            }
        },
        execApplyDefaultValRule() {
            this.formConfig.sections.forEach(el => {
                el.columns.forEach(c => {
                    c.fields.forEach(f => {
                        if (f.rules) {
                            if (!f.defaultValue) {
                                const rule = f.rules.find(rule => rule.event === 'defaultValue')
                                if (rule && !this.doc[f.name]) {
                                    this.$set(
                                        this.doc,
                                        f.name,
                                        f.defaultValue = eval(rule.script)
                                    );
                                }
                            }
                        }
                    })
                });
            });
        }
    },
    mounted() {
        this.execApplyDefaultValues();
        this.execApplyDefaultValRule();
    },
    activated() {
        this.execApplyDefaultValues();
        this.execApplyDefaultValRule();
    }
}
</script>
