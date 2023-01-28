<template>
    <b-modal id="rb-doc-template-section-modal" modal-class="rb-doc-template-section-modal"
             ok-title="Сохранить изменения"
             cancel-variant="outline-gray"
             cancel-title="Отмена"
             @ok.prevent="onOk"
             :title="title">
        <b-form @submit.prevent="onOk">
            <b-form-row>
                <b-col lg="12">
                    <b-form-group label="Наименование секции">
                        <b-form-input v-model="label"></b-form-input>
                    </b-form-group>
                </b-col>
            </b-form-row>
        </b-form>
    </b-modal>
</template>

<script>
    export default {
        name: 'DocTemplateSectionModal',
        props: {
            section: Object,
            mode: {type: String, default: 'ins'},
            onAfterOk: {type: Function, default: () => {}}
        },
        data() {
            return {
                id: 'rb-doc-template-section-modal',
                label: null
            }
        },
        computed: {
            title() {
                return this.mode === 'ins' ? 'Добавление секции' : 'Редактирование секции';
            }
        },
        watch: {
            section() {
                if(this.section) {
                    this.label = this.section.labelRu;
                }
            }
        },
        methods: {
            onOk() {
                this.section.labelRu = this.label;
                if(this.onAfterOk) {
                    this.onAfterOk();
                }
                this.$nextTick(() => {
                    this.$bvModal.hide(this.id);
                });
            }
        },
        created() {
            if(this.section) {
                this.label = this.section.labelRu;
            }
        }
    }
</script>
