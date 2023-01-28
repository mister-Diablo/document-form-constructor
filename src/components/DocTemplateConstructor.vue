<template>
    <div class="rb-doc-template-constructor d-flex">
        <doc-template-facet-list @fieldMoveEnd="onFieldMoveEnd" :facets="facets"></doc-template-facet-list>

        <div class="rb-form-constructor flex-fill">
            <div class="rb-constructor-toolbar d-flex flex-row">
                <h4>Добавить секцию: </h4>
                <div class="rb-layout-buttons">
                    <b-button pill variant="outline-gray" @click="addSection(1)">
                        <rb-text>Секция с 1 колонкой</rb-text>
                        <rb-icon :icon="iconAdd"></rb-icon>
                    </b-button>
                    <b-button pill variant="outline-gray" @click="addSection(2)">
                        <rb-text>Секция с 2 колонками</rb-text>
                        <rb-icon :icon="iconAdd"></rb-icon>
                    </b-button>
                    <b-button pill variant="outline-gray" @click="addSection(3)">
                        <rb-text>Секция с 3 колонками</rb-text>
                        <rb-icon :icon="iconAdd"></rb-icon>
                    </b-button>
                </div>
            </div>

            <div class="rb-constructor-body">
                <draggable v-model="formConfig.section"
                           :animation="200"
                           group="section"
                           ghost-class="rb-form-card-moving"
                           handle=".rb-row-drag-handle">
                    <b-card v-for="(section, index) in formConfig.sections" :key="section.labelRu"
                            class="rb-form-card" :data-hash="hash">
                        <template #header>
                            <rb-icon :icon="iconDrag"
                                     class="cursor-pointer rb-row-drag-handle"></rb-icon>
                            <rb-text class="flex-fill" @click="editSection(section)">
                                {{ section.labelRu }}
                            </rb-text>
                            <span class="rb-actions">
                                <rb-icon :icon="iconEdit" class="cursor-pointer"
                                         @click="editSection(section)"></rb-icon>
                                <rb-icon :icon="iconDelete" class="cursor-pointer"
                                         @click="removeSection(section, index)"></rb-icon>
                            </span>
                        </template>

                        <div class="d-flex flex-row">
                            <draggable tag="b-form"
                                       class="rb-form-column"
                                       v-for="column in section.columns"
                                       :key="column.index"
                                       :class="{'rb-single-column': section.columnCount === 1}"
                                       v-model="column.fields"
                                       @add="onFieldAddedToColumn($event, column, section)"
                                       :animation="200"
                                       group="fields"
                                       ghost-class="rb-moving-item"
                                       handle=".rb-field-drag-handle">
                                <b-form-row v-for="field in column.fields" :key="field.name"
                                            class="cursor-pointer" @click="showProperties(field, $event)">
                                    <b-col lg="12">
                                        <b-form-group :label="field.labelRu">
                                            <template #label>
                                                <rb-icon :icon="iconDrag" class="rb-field-drag-handle"></rb-icon>
                                                <rb-text>{{ field.labelRu }}</rb-text>
                                                <rb-icon :icon="iconDelete" class="rb-remove-field"
                                                         @click.prevent="onRemoveField($event, field, column)">
                                                </rb-icon>
                                            </template>
                                            <component v-bind:is="field.input.type"
                                                       :id="field.name"
                                                       v-if="field.input"
                                                       v-bind="getFieldExtendedPropsData(field)"
                                                       disabled
                                                       class="cursor-pointer">
                                            </component>
                                        </b-form-group>
                                    </b-col>
                                </b-form-row>
                            </draggable>
                        </div>
                    </b-card>
                </draggable>
            </div>

            <doc-template-field-sidebar v-model="sidebarField"
                                        :visible="sidebarVisible"
                                        :form-config="formConfig"
                                        @hide="sidebarVisible=false">
            </doc-template-field-sidebar>

            <doc-template-section-modal :mode="sectionModalCfg.mode"
                                        :section="sectionModalCfg.section"
                                        :on-after-ok="sectionModalCfg.onAfterOk">
            </doc-template-section-modal>
        </div>
    </div>
</template>

<script>
    import DocTemplateFacetList from "@/components/DocTemplateFacetList";
    import DocTemplateFieldSidebar from "@/components/DocTemplateFieldSidebar";
    import DocTemplateSectionModal from "@/components/DocTemplateSectionModal";
    import draggable from 'vuedraggable';
    import {UtFormConfig} from "../utils/UtFormConfig";
    import {UtFormConstructor} from "../utils/UtFormConstructor";

    export default {
        name: 'DocTemplateConstructor',
        components: {DocTemplateFacetList, DocTemplateFieldSidebar, DocTemplateSectionModal, draggable},
        props: {
            formConfig: {
                type: Object, default: () => {
                    return {sections: []}
                }
            },
            facets: {type: Array, default: () => []}
        },
        data() {
            return {
                sidebarVisible: false,
                sidebarField: null,
                columnTo: false,
                hash: '',
                sectionModalCfg: {
                    id: 'rb-doc-template-section-modal',
                    mode: 'ins',
                    section: null,
                    onAfterOk() {
                    }
                }
            }
        },
        computed: {
            iconAdd() {
                return UtFormConstructor.config.icons.iconAdd;
            },
            iconEdit() {
                return UtFormConstructor.config.icons.iconEdit;
            },
            iconDelete() {
                return UtFormConstructor.config.icons.iconDelete;
            },
            iconDrag() {
                return UtFormConstructor.config.icons.iconDrag;
            }
        },
        methods: {
            showProperties(field, event) {
                if (event.target.classList
                    && event.target.classList.contains('rb-remove-field')) {
                    return;
                }

                this.sidebarVisible = true;
                this.sidebarField = field;
            },
            addSection(columnCount) {
                let section = {labelRu: null, columnCount: columnCount};
                this.sectionModalCfg.mode = 'ins';
                this.sectionModalCfg.section = section;
                this.sectionModalCfg.onAfterOk = () => {
                    section.columns = [];
                    for (let i = 0; i < columnCount; i++) {
                        section.columns.push({
                            index: i,
                            fields: []
                        });
                    }

                    this.formConfig.sections.push(section)
                }
                this.$bvModal.show(this.sectionModalCfg.id);
            },
            editSection(section) {
                this.sectionModalCfg.mode = 'update';
                this.sectionModalCfg.section = section;
                this.sectionModalCfg.onAfterOk = () => {
                }
                this.$bvModal.show(this.sectionModalCfg.id);
            },
            removeSection(section, index) {
                this.formConfig.sections.splice(index, 1);
                /*UtModal.showYesNoDialog('Вы действительно хотите удалить секцию?', {
                    onOk: (event, modal) => {
                        this.formConfig.sections.splice(index, 1);
                        UtModal.closeModal(modal);
                    }
                });*/
            },
            multipleFieldAreOnFormConfig(field) {
                let count = 0;
                this.formConfig.sections.forEach(s => {
                    s.columns.forEach(c => {
                        c.fields.forEach(f => {
                            if (f.name === field.name) {
                                count++;
                            }
                        })
                    })
                });
                return count > 1;
            },
            removeFieldFromColumn(field, column, newIndex) {
                let index = newIndex != null ? newIndex : -1;

                if (index < 0) {
                    index = column.fields.findIndex(f => field.name === f.name);
                }

                if (index >= 0) {
                    column.fields.splice(index, 1);
                }
            },
            onRemoveField(event, field, column) {
                event.preventDefault();
                this.removeFieldFromColumn(field, column)
            },
            onFieldAddedToColumn(event, column, section) {
                this.columnTo = column;
            },
            onFieldMoveEnd(event) {
                const {newIndex} = event;
                let field = event.item._underlying_vm_;

                if (!field.hasOwnProperty('defaultValue')) {
                    field.defaultValue = null
                }

                let found = this.multipleFieldAreOnFormConfig(field);
                if (found) {
                    this.removeFieldFromColumn(field, this.columnTo, newIndex);
                    this.resetDragVariables();
                    this.$bvModal.msgBoxOk('На форме уже есть это поле', {
                        title: 'Ошибка',
                        headerClass: 'rb-error-msg-box__header',
                        bodyClass: 'rb-error-msg-box__body',
                        footerClass: 'rb-error-msg-box__footer',
                        centered: true,
                        noCloseOnBackdrop: true,
                        noCloseOnEsc: true
                    });
                }
                this.resetDragVariables();
                this.hash = (Math.random() + 1).toString(36).substring(7);
            },
            getFieldExtendedPropsData(field) {
                return {...field.input.propsData, placeholder: field.tag, disabled: true};
            },
            resetDragVariables() {
                this.columnTo = null;
            },
        },
    }
</script>
