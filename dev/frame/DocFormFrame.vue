<template>
    <b-modal :id="id" title="Предварительный просмотр"
             modal-class="rb-document-template-preview-modal-frame"
             size="lg"
             @ok.prevent="onOk"
    >
        <doc-form :form-config="formConfig" :doc="doc" apply-default-values ref="form"></doc-form>
    </b-modal>
</template>

<script>
    import DocForm from "../../src/components/DocForm";

    export default {
        name: 'DocumentTemplatePreviewModalFrame',
        components: {DocForm},
        props: {
            id: [Number, String],
            formConfig: null,
        },
        data() {
            return {
                doc: {},
                validationState: {},
            }
        },
        methods: {
            onOk() {
                let validationResult = this.$refs.form.validate();
                if(!validationResult) {

                }
            }
        }
    }
</script>
