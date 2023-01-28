export const UtFormConfig = {
    findField(fieldName, formConfig) {
        if (!formConfig || !formConfig.sections) {
            return null;
        }

        let found = null;
        formConfig.sections.every(r => {
            if (r.columns) {
                r.columns.every(c => {
                    c.fields.forEach(f => {
                        if (f.name === fieldName) {
                            found = f;
                        }
                    });

                    if (found) {
                        return false;
                    }
                })
            }

            if (found) {
                return false;
            }
        });

        return found;
    },
    findRule(ruleId, formConfig) {
        if (!formConfig || !formConfig.sections) {
            return null;
        }

        let found = null;
        formConfig.sections.every(s => {
            if (s.columns) {
                s.columns.every(c => {
                    c.fields.every(f => {
                        if (f.rules) {
                            f.rules.forEach(r => {
                                if (r.id === ruleId) {
                                    found = r;
                                }
                            })
                        }

                        if (found) {
                            return false;
                        }
                    });

                    if (found) {
                        return false;
                    }
                })
            }

            if (found) {
                return false;
            }
        });

        return found;
    },
    getFields(formConfig) {
        let fields = [];
        formConfig.sections.forEach(s => {
            if (s.columns) {
                s.columns.forEach(c => {
                    if (c.fields) {
                        c.fields.forEach(f => {
                            fields.push(f);
                        });
                    }
                })
            }
        });
        return fields;
    },
    parseFacets(formConfig) {
        let facets = [];

        formConfig.sections.forEach(section => {
            section.columns.forEach(c => {
                c.fields.forEach(f => {
                    if (facets.indexOf(f.facet) < 0) {
                        facets.push(f.facet);
                    }
                });
            });
        });

        return facets;
    }
}
