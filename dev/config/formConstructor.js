import {rubles} from 'rubles';

let __clone = function (data) {
    return JSON.parse(JSON.stringify(data));
}

let dropdown = {
    text: 'Выпадающий список',
    name: 'dropdown',
    type: 'rb-dropdown-input',
    props: {
        block: {type: 'boolean', default: true, label: 'Растянуть', visible: true}
    },
    propsData: {},
    defaultValue: null,
}

let multiDropdown = {
    text: 'Выбор нескольких значений',
    name: 'multiDropdown',
    type: 'rb-multi-dropdown-input',
    props: {
        block: {type: 'boolean', default: true, label: 'Растянуть', visible: true}
    },
    propsData: {},
    defaultValue: null,
    multiple: true,
}

export const formConstructorConfig = {
    inputs: {
        dropdown: __clone(dropdown),
        multiDropdown: __clone(multiDropdown),
    },
    refInputs: {
        usr: [
            __clone(dropdown),
            __clone(multiDropdown),
        ]
    },
    refInputConfigs: {
        usr: {
            dropdown: {
                propsData: {
                    valueField: 'id',
                    titleField: 'name',
                    items: [
                        {id: 1, name: 'One'},
                        {id: 2, name: 'Two'},
                        {id: 3, name: 'Мегасуперогромныйвыбориздропдауна'}
                    ]
                }
            },
            multiDropdown: {
                propsData: {
                    valueField: 'id',
                    displayField: 'name',
                    items: [
                        {id: 1, name: 'One'},
                        {id: 2, name: 'Two'}
                    ]
                }
            }
        }
    },
    rules: [
        {
            name: 'Test',
            labelRu: 'Тест',
            labelEn: 'Test',
            labelKz: 'Тест',
            fields: ['defectedActNumber'],
            event: 'input',
            script: `
                doc['defectedActNumberString'] = 'Тест успешен';
            `,
        },
        {
            name: 'rubles',
            labelRu: 'Рубли прописью',
            labelEn: 'Rubles as text',
            labelKz: 'Рубли прописью',
            fields: ['defectedActNumber'],
            event: 'input',
            script: `
                if(doc['defectedActNumber'] != null) {
                    doc['defectedActNumberString'] = rubles(event);
                }
            `,
        },
        {
            name: 'defaultDate',
            labelRu: 'Дата + n дней',
            labelEn: 'Date + n days',
            labelKz: 'Күні + N күн',
            fields: ['defectedActDt'],
            event: 'defaultValue',
            script: `
                let date = new Date();
                const days = кол-во дней;
                date.setDate(date.getDate() + days);
            `,
        },
    ],
    ruleContext: {
        rubles: rubles,
    }
}
