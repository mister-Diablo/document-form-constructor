<template>
    <div class="rb-facets-sidebar">
        <h4>Компоненты</h4>
        <b-form>
            <b-form-row>
                <b-col lg="12">
                    <b-form-group>
                        <b-form-input placeholder="Название поля" v-model="facetSearchStr">
                        </b-form-input>
                    </b-form-group>
                </b-col>
            </b-form-row>
        </b-form>
        <div class="rb-facet-list">
            <div class="rb-facet" v-for="facet in innerFacets"
                 :key="facet.name" v-if="facet.fields.length > 0">
                <h6 class="rb-facet-label d-flex cursor-pointer" @click="facet.expanded = !facet.expanded">
                    <rb-text class="flex-fill">{{ facet.labelRu }}</rb-text>
                    <rb-icon :icon="facet.expanded? iconCollapseFacet: iconExpandFacet"></rb-icon>
                </h6>

                <b-list-group v-if="facet.expanded">
                    <draggable v-model="facet.fields"
                               :clone="onFieldCloned"
                               :animation="200"
                               :group="{name: 'fields', pull: 'clone', put: false}"
                               @end="onFieldMoveEnd($event)"
                               ghost-class="rb-facet-field-moving">
                        <b-list-group-item v-for="field in facet.fields"
                                           :id="field.name + 'Sidebar'"
                                           :key="field.name"
                                           class="cursor-pointer">
                            <rb-text>{{ field.labelRu }}</rb-text>
                        </b-list-group-item>
                    </draggable>
                </b-list-group>
            </div>
        </div>
    </div>
</template>

<script>
    import draggable from "vuedraggable";
    import {UtFormConfig} from "@/utils/UtFormConfig";
    import {UtFormConstructor} from "../utils/UtFormConstructor";

    export default {
        name: 'DocTemplateFacetList',
        components: {draggable},
        props: {
            facets: {type: Array, default: () => []}
        },
        data() {
            return {
                allFacets: [],
                innerFacets: [],
                facetSearchStr: null,
            }
        },
        computed: {
            iconExpandFacet() {
                return UtFormConstructor.config.icons.iconExpandFacet;
            },
            iconCollapseFacet() {
                return UtFormConstructor.config.icons.iconCollapseFacet;
            },
        },
        watch: {
            facetSearchStr() {
                this.findInFacets(this.facetSearchStr);
            },
            facets() {
                this.handleFacetsProp();
            }
        },
        methods: {
            onFieldCloned(cloneField) {
                let field = JSON.parse(JSON.stringify(cloneField));
                field.input = UtFormConstructor.getDefaultInput(field);
                return field;
            },
            onFieldMoveEnd(event) {
                this.$emit('fieldMoveEnd', event);
            },
            findInFacets(str) {
                str = str.toLowerCase();
                if (!str || str.length === 0) {
                    this.innerFacets = this.allFacets;
                }
                let facets = JSON.parse(JSON.stringify(this.allFacets));
                facets = facets.filter(facet => {
                    let facetFound = false;
                    facet.fields = facet.fields.filter(field => {
                        let fieldFound = field.labelRu.toLowerCase().indexOf(str) >= 0;
                        if (fieldFound) {
                            facetFound = true;
                        }
                        return fieldFound;
                    });
                    return facetFound;
                });
                this.innerFacets = facets;
            },
            handleFacetsProp() {
                let innerFacets = this.facets.map(f => ({...f, expanded: false}));
                if (innerFacets) {
                    innerFacets.forEach(facet => {
                        facet.fields = facet.fields.filter(field => !field.hiddenOnFormConfig);
                    })
                }
                this.innerFacets = JSON.parse(JSON.stringify(innerFacets));
                this.allFacets = JSON.parse(JSON.stringify(innerFacets));
            },
        },
        created() {
            this.handleFacetsProp();
        }
    }
</script>
