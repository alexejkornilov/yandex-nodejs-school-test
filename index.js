"use strict";

const MyForm = (() => {
    let self = {}

    const rules = {
        fio: val => {
            const length = 3;
            return val
                .split(/\s/g)
                .map(item => {
                    return /[а-яёa-z]+/i.test(item)
                })
                .filter(item => item === true)
                .length == length
        },

        email: val => {
            const emailDomain = ['ya.ru', 'yandex.ru', 'yandex.ua', 'yandex.by', 'yandex.kz', 'yandex.com'];
            let items = val.match(/[a-zA-Z1-9\-\._]+@([a-z1-9.]+){1}/i)

            if (items.length != 2) return false

            return emailDomain.includes(items[1])
        },

        phone: val => {
            const phoneDigitCount = 70;
            let result = /\+7\([\d+]{3}\)[\d+]{3}\-[\d+]{2}\-[\d+]{2}/i.test(val)
            if (result) {
                let sum = 0
                val
                    .replace(/[^\d]/g, "")
                    .match(/(\d){1}/g)
                    .forEach(num => sum += parseInt(num))
                result = sum <= phoneDigitCount
            }

            return result
        }
    }

    let myForm;
    let submitButton;
    let resultContainer;
    let aseptFormFields = {
        fio: null,
        email: null,
        phone: null
    }

    let values = {
        fio: "",
        email: "",
        phone: ""
    }

    self.validate = () => {
        self.getData()
        let rule = Object.entries(rules)

        let result = {
            isValid: false,
            errorFields: [],
        }

        result.isValid = rule
            .map(item => {
                let field = item[0],
                    rule = item[1]

                if (!values[field]) {
                    result.errorFields.push(field)
                    return false
                }

                if (!rule(values[field])) {
                    result.errorFields.push(field)
                    return false
                }

                return true
            })
            .filter(value => value == true)
            .length == rule.length

        return result
    }

    self.getData = () => {
        myForm = document.querySelector('#myForm');
        aseptFormFields['fio'] = myForm.querySelector('[name="fio"]');
        aseptFormFields['email'] = myForm.querySelector('[name="email"]');
        aseptFormFields['phone'] = myForm.querySelector('[name="phone"]');

        Object.entries(aseptFormFields).forEach(item => {
            let fieldName = item[0],
                fieldInput = item[1]

            values[fieldName] = fieldInput.value


        });
        return values;
    }

    self.setData = dataObj => {
        Object.keys(aseptFormFields).forEach(field => {
            if (dataObj[field] !== undefined) {
                aseptFormFields[field].value = dataObj[field]
            }
        })
    }
    let isSubmited = false
    self.submit = () => {
        if (isSubmited) return

        let result = self.validate()

        myForm = document.querySelector('#myForm');
        aseptFormFields['fio'] = myForm.querySelector('[name="fio"]');
        aseptFormFields['email'] = myForm.querySelector('[name="email"]');
        aseptFormFields['phone'] = myForm.querySelector('[name="phone"]');
        submitButton = document.querySelector('#submitButton')
        resultContainer = document.querySelector('#resultContainer')
        

        Object.entries(aseptFormFields).forEach(item => {
            let fieldName = item[0],
                fieldInput = item[1]

            if (result.errorFields.includes(fieldName)) {
                fieldInput.classList.add('error')
                fieldInput.classList.remove('success')
            } else {
                fieldInput.classList.add('success')
                fieldInput.classList.remove('error')
            }

        });



        if (!result.isValid) return

        submitButton.disabled = true

			let fetchJSONFile = () => {
				const xhr = new XMLHttpRequest();

				xhr.open('GET', document.getElementById('myForm').action, false);
				xhr.send();
				const successStatusCode = 200;
				const completeCode = 4;

				if (xhr.readyState === completeCode) {
					if (xhr.status === successStatusCode) {
						let data = JSON.parse(xhr.responseText);

						if (data.status === 'success') {
							resultContainer.className = 'success';
							resultContainer.innerHTML = 'Success';
						} else if (data.status === 'error') {
							resultContainer.className = 'error';
							resultContainer.innerHTML = data.reason;
						} else if (data.status === 'progress') {
							resultContainer.className = 'progress';
							setTimeout(() => {
								fetchJSONFile();
							}, data.timeout);
						}
					}
				}
			};

			fetchJSONFile()
    }

    window.addEventListener('load', e => {
        myForm = document.querySelector('#myForm')
        aseptFormFields['fio'] = myForm.querySelector('[name="fio"]')
        aseptFormFields['email'] = myForm.querySelector('[name="email"]')
        aseptFormFields['phone'] = myForm.querySelector('[name="phone"]')
        submitButton = document.querySelector('#submitButton')
        resultContainer = document.querySelector('#resultContainer')

        myForm.addEventListener('submit', e => {
            e.preventDefault()
            MyForm.submit()
        })

        Object.entries(aseptFormFields).forEach(item => {
            let fieldName = item[0],
                fieldInput = item[1]

            fieldInput.addEventListener('change', e => {
                values[fieldName] = e.target.value

                let result = self.validate()

            })
        });

        self.validate()
    })

    return self;
})();
console.log('test');