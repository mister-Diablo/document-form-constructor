import safeEval from 'notevil';

let __clone = function (data) {
    return JSON.parse(JSON.stringify(data));
}

let __assign = function () {
    __assign = Object.assign || function __assign(t) {
        for (let s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (let p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

let __mergeInputInMapOfArrays = function (inputs, formConfigInputs) {
    for (let dataType in formConfigInputs) {
        let foundInputs = inputs[dataType];
        if (foundInputs) {
            __mergeInputsInArray(foundInputs, formConfigInputs[dataType]);
        } else {
            inputs[dataType] = formConfigInputs[dataType];
        }
    }
};

let __mergeInputsInMap = function (inputs, formConfigInputs) {
    for (let name in formConfigInputs) {
        inputs[name] = __assign(
            inputs[name] ? inputs[name] : {},
            formConfigInputs[name] ? formConfigInputs[name] : {}
        );
    }
};

let __mergeInputsInArray = function (inputs, formConfigInputs) {
    formConfigInputs.forEach(input => {
        let index = inputs.findIndex(item => (item.name === input.name));
        if (index >= 0) {
            inputs[index] = input;
        } else {
            inputs.push(input);
        }
    })
};

let __applyDefaultProps = function (input, field) {
    for (let propName in input.props) {
        if(field){
            if(field.input.propsData[propName]) {
                input.propsData[propName] = field.input.propsData[propName];
                if (input.propsData?.type && input.props?.type?.default) {
                    input.propsData.type = input.props.type.default;
                }
            }
        } else {
            input.propsData[propName] = input.props[propName].default;
        }
    }
};

let __applyRefProps = function (input, refConfig) {
    if (refConfig?.propsData) {
        for (let propName in refConfig.propsData) {
            input.propsData[propName] = refConfig.propsData[propName];
        }
    }
};

let __filterInputsByMultiple = function (inputs, multiple) {
    return inputs.filter(i => {
        return i.multiple && multiple || !i.multiple && !multiple;
    });
};

let fcInputs = {
    string: {
        text: 'Текст',
        name: 'string',
        type: 'b-form-input',
        props: {
            placeholder: {type: 'string', default: null, label: 'Надпись внутри', visible: true},
            type: {type: 'string', default: 'text', label: 'Тип данных', visible: true},
        },
        propsData: {},
        defaultValue: null,
    },
    number: {
        text: 'Число',
        name: 'number',
        type: 'b-form-input',
        props: {
            placeholder: {type: 'string', default: null, label: 'Надпись внутри', visible: true},
            type: {type: 'string', default: 'number', label: 'Тип данных', visible: true},
            min: {type: 'number', default: null, label: 'Минимальное значение', visible: true},
        },
        propsData: {},
        defaultValue: null,
    },
    memo: {
        text: 'Большой текст',
        name: 'memo',
        type: 'b-form-textarea',
        props: {
            placeholder: {type: 'string', default: null, label: 'Надпись внутри', visible: true},
        },
        propsData: {},
        defaultValue: null,
    },
    date: {
        text: 'Дата',
        name: 'date',
        type: 'rb-date-picker-input',
        props: {
            minCurrentDate: {type: 'boolean', default: false, label: 'Установить текущую дату как минимальную', visible: true},
            minDate: {type: 'date', default: null, label: 'Установить минимальную дату', visible: true},
            maxDate: {type: 'date', default: null, label: 'Установить максимальную дату', visible: true},
        },
        propsData: {},
        defaultValue: null,
    },
    datetime: {
        text: 'Дата и вермя',
        name: 'date',
        type: 'rb-date-picker-input',
        props: {
            minDate: {type: 'date', default: null, label: 'Установить минимальную дату', visible: true},
            maxDate: {type: 'date', default: null, label: 'Установить максимальную дату', visible: true},
        },
        propsData: {},
        defaultValue: null,
    },
    phone: {
        text: 'Телефон',
        name: 'phone',
        type: 'rb-phone-input',
        props: {
            placeholder: {type: 'string', default: 'Телефон', label: 'Надпись внутри', visible: true},
        },
        propsData: {},
        defaultValue: null,
    },
    boolean: {
        text: 'Булевое',
        name: 'boolean',
        type: 'rb-boolean-single-option-input',
        props: {
            block: {type: 'boolean', default: true, label: 'Растянуть', visible: true},
            bordered: {type: 'boolean', label: 'Граница вокруг', default: true, visible: true},
        },
        propsData: {},
        defaultValue: null,
    },
    email: {
        text: 'Email',
        name: 'email',
        type: 'rb-email-input',
        props: {},
        propsData: {},
        defaultValue: [],
        multiple: true
    }
};

let fcPrimitiveInputs = {
    string: [
        __clone(fcInputs.string),
        __clone(fcInputs.number),
        __clone(fcInputs.memo),
        __clone(fcInputs.phone)
    ],
    memo: [
        __clone(fcInputs.memo),
        __clone(fcInputs.string),
    ],
    number: [
        __clone(fcInputs.string),
        __clone(fcInputs.number),
    ],
    double: [
        __clone(fcInputs.string),
        __clone(fcInputs.number),
    ],
    float: [
        __clone(fcInputs.string),
        __clone(fcInputs.number),
    ],
    integer: [
        __clone(fcInputs.string),
        __clone(fcInputs.number),
    ],
    long: [
        __clone(fcInputs.string),
        __clone(fcInputs.number),
    ],
    date: [
        __clone(fcInputs.date)
    ],
    datetime: [
        __clone(fcInputs.datetime)
    ],
    boolean: [
        __clone(fcInputs.boolean)
    ],
    email: [
        __clone(fcInputs.email)
    ]
}

let fcDictInputs = []

let fcRefInputs = {}

let fcRefInputConfigs = {}

let baseConfig = {
    inputs: __clone(fcInputs),
    primitiveInputs: __clone(fcPrimitiveInputs),
    dictInputs: __clone(fcDictInputs),
    refInputs: __clone(fcRefInputs),
    refInputConfigs: __clone(fcRefInputConfigs),
    rules: [],
    icons: {
        iconExpandFacet: 'icon-chevron-down',
        iconCollapseFacet: 'icon-chevron-up',
        iconCloseFieldSidebar: 'icon-chevron-right',
        iconOpenFieldSidebar: 'icon-chevron-left',
        iconAdd: 'icon-add',
        iconEdit: 'icon-edit',
        iconDelete: 'icon-delete',
        iconDrag: 'icon-reorder',
    },
    ruleContext: {}
}

export const UtFormConstructor = {
    config: {},

    init(formConfig) {
        this.config = __clone(baseConfig);

        if (formConfig) {

            if (formConfig.inputs) {
                __mergeInputsInMap(this.config.inputs, formConfig.inputs);
            }

            if (formConfig.primitiveInputs) {
                __mergeInputInMapOfArrays(this.config.primitiveInputs, formConfig.primitiveInputs);
            }

            if (formConfig.dictInputs) {
                __mergeInputsInArray(this.config.dictInputs, formConfig.dictInputs)
            }

            if (formConfig.refInputs) {
                __mergeInputInMapOfArrays(this.config.refInputs, formConfig.refInputs);
            }

            if (formConfig.refInputConfigs) {
                this.config.refInputConfigs = formConfig.refInputConfigs;
            }

            if (formConfig.icons) {
                this.config.icons = __assign(this.config.icons, formConfig.icons)
            }

            if (formConfig.rules) {
                this.config.rules = formConfig.rules;
            }

            if (formConfig.ruleContext) {
                this.config.ruleContext = formConfig.ruleContext;
            }
        }
    },
    getInputTypes(field) {
        let inputs = [];

        if (!field) {
            return inputs;
        }

        if (field.dict && !this.config.refInputs[field.ref]) {
            inputs = __filterInputsByMultiple(this.config.dictInputs, field.multiple);
        } else if (field.ref) {
            inputs = __filterInputsByMultiple(this.config.refInputs[field.ref], field.multiple);
        } else {
            inputs = __filterInputsByMultiple(this.config.primitiveInputs[field.type], field.multiple);
        }

        return inputs;
    },
    hasMultipleInputTypes(field) {
        let inputs = this.getInputTypes({...field, multiple: true});
        return inputs && inputs.length > 0;
    },
    getDefaultInput(field) {
        let input = null;
        let inputs = this.getInputTypes(field);

        if (!inputs) {
            input = this.primitiveInputs[0];
        }

        if (field.ref && this.config.refInputs[field.ref]) {
            input = __clone(inputs[0]);
            __applyDefaultProps(input);
            if (this.config.refInputConfigs[field.ref]
                && this.config.refInputConfigs[field.ref][input.name]) {
                __applyRefProps(input, this.config.refInputConfigs[field.ref][input.name]);
            }
        } else if (field.dict) {
            input = __clone(inputs[0]);
            input.props.dict.default = field.ref;
            __applyDefaultProps(input);
        } else {
            input = __clone(inputs[0]);
            __applyDefaultProps(input);
        }

        return input;
    },
    getInputTypeByName(name, field) {
        let input = __clone(this.config.inputs[name]);

        if (field.ref && this.config.refInputs[field.ref]) {
            __applyDefaultProps(input);
            if (this.config.refInputConfigs[field.ref]
                && this.config.refInputConfigs[field.ref][input.name]) {
                __applyRefProps(input, this.config.refInputConfigs[field.ref][input.name]);
            }
        } else if (field.dict) {
            input.props.dict.default = field.ref;
            __applyDefaultProps(input);
        } else {
            __applyDefaultProps(input, field);
        }

        input.propsData['ref'] = field.name;
        return input;
    },
    getAvailableFieldRules(field) {
        return this.config.rules.filter(rule => {
            return !rule.fields || rule.fields.length === 0
                || rule.fields.indexOf(field.name) >= 0
        });
    },
    getRuleContext() {
        return this.config.ruleContext;
    },
    runRule(context, script) {
        context = context ? context : {};
        context['console'] = console;
        context['Date'] = Date;
        context['Math'] = Math;

        let func = function (script) {
            return safeEval(script, context);
        }

        func.call(context, script);
    },
}
