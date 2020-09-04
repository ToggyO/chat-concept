/**
 * Описание: Файл содержит класс хелпер (и функцию, инициализирующую его)
 * для валидации входных параметров запросов
 */
import validator from 'validator';
import { VALIDATION_ERRORS } from '@constants';

export class Validator {
  constructor({
    value,
    field,
    shouldTrimValue = true,
    additionalParams,
  }) {
    this.error = null;
    this.value = shouldTrimValue && typeof value === 'string' ? value.trim() : value;
    this.field = field;
    this.additionalParams = additionalParams;
  }

	/**
   * Константа, определяющая, необходимо ли возвращать массив ошибок пустым
   * @private shouldReturnEmptyError
   */
	#shouldReturnEmptyError = false;

	/**
   * Установить новую ошибку как результат валидации
   * @private
   * @param {string} errorMessage - сообщение об ошибке
   * @param {string} field - код ошибки
   * @param {string} errorCode - код ошибки
   * @param {object} additionalParams - дополнительные параметры для отображения ошибки на клиенте
   * @returns {object}
   */
	#setNewError = ({
	  field,
	  errorCode,
	  errorMessage,
	}) => {
	  this.error = {
	    field,
	    errorCode,
	    errorMessage,
	  };
	};

	/**
   * Вернуть результат валидации
   * @returns {object}
   */
  result = () => {
  	if (this.#shouldReturnEmptyError) {
  		return [];
  	}
  	return this.error ? [this.error] : [];
  };

  /**
   * Валидация: необязательный параметр
   * Останавливает цепочку валидации, при пустом проверяемом значении
   * @returns {this}
   */
  notRequired = () => {
  	if (!this.value && this.value !== false) {
  		this.#shouldReturnEmptyError = true;
  	}
  	return this;
  };

	/**
   * Валидация: обязательный параметр
   * @param required - если required === false, то метод работает как this.notRequired
   * @returns {this}
   */
	required = (required = true) => {
	  if (this.error || this.#shouldReturnEmptyError) return this;
	  if (!required) {
	    this.notRequired();
	    return this;
	  }
	  if (!this.value && this.value !== false && this.value !== 0) {
	    this.#setNewError(VALIDATION_ERRORS.requiredField({ field: this.field }));
	  }
	  return this;
	};

	/**
   * Валидация: значение является числом
   * @returns {this}
   */
	isNumber = () => {
	  if (this.error || this.#shouldReturnEmptyError) return this;
	  if (typeof this.value !== 'number') {
	    this.#setNewError(VALIDATION_ERRORS.isNumber({ field: this.field }));
	  }
	  return this;
	};

	/**
	 * Вилидация: значение является массивом
	 * @param {any} itemsType - тип для элементов массива
	 * @returns {this}
	 */
	isArray = ({ itemsType } = {}) => {
	  if (this.error || this.#shouldReturnEmptyError) return this;
	  if (!Array.isArray(this.value)) {
	    this.#setNewError(VALIDATION_ERRORS.isArray({ field: this.field }));
	  }
	  if (itemsType && this.value.some(item => typeof item !== itemsType)) {
	    this.#setNewError(VALIDATION_ERRORS.isAllItemsOfType({ field: this.field, itemType: itemsType }));
	  }
	  return this;
	}

	/**
	 * Валидация: значение содержит только цифры
	 * @returns {this}
	 */
	isContainsOnlyNumbers = () => {
	  if (this.error || this.#shouldReturnEmptyError) return this;
	  if (!/^\d+$/.test(this.value)) {
	    this.#setNewError(VALIDATION_ERRORS.isContainsOnlyNumbers({ field: this.field }));
	  }
	  return this;
	};

	/**
	 * Валидация: значение является булевым
	 * @returns {this}
	 */
	isBoolean = () => {
	  if (this.error || this.#shouldReturnEmptyError) return this;
	  if (typeof this.value !== 'boolean') {
	    this.#setNewError(VALIDATION_ERRORS.isBoolean({ field: this.field }));
	  }
	  return this;
	};

	/**
	 * Валидация: минимальная длина
	 * @param {number} minLength
	 * @returns {this}
	 */
	minLength = ({ minLength }) => {
	  if (this.error || this.#shouldReturnEmptyError) return this;
	  if ((this.value || this.value === 0) && (`${this.value}`).length < minLength) {
	    this.#setNewError({
	      ...VALIDATION_ERRORS.minLength({ field: this.field, minLength }),
	      additionalParams: { minLength },
	    });
	  }
	  return this;
	};

	/**
	 * Валидация: максимальная длина
	 * @param {number} minLength
	 * @returns {this}
	 */
	maxLength = ({ maxLength }) => {
	  if (this.error || this.#shouldReturnEmptyError) return this;
	  if ((this.value || this.value === 0) && (`${this.value}`).length > maxLength) {
	    this.#setNewError({
	      ...VALIDATION_ERRORS.maxLength({ field: this.field, maxLength }),
	      additionalParams: { maxLength },
	    });
	  }
	  return this;
	};

	/**
	 * Валидация числа на вхождение в заданный интервал
	 * @param {number} minValue - нижняя граница интервала
	 * @param {number} maxValue - верхняя граница интервала
	 * @returns {this}
	 */
	number = ({ minValue, maxValue }) => {
	  if (this.error || this.#shouldReturnEmptyError) return this;
	  if (this.value && typeof minValue === 'number' && this.value < minValue) {
	    this.#setNewError({
	      ...VALIDATION_ERRORS.minValue({ field: this.field, minValue }),
	      additionalParams: { minValue },
	    });
	  } else if (this.value && typeof maxValue === 'number' && this.value > maxValue) {
	    this.#setNewError({
	      ...VALIDATION_ERRORS.maxValue({ field: this.field, maxValue }),
	      additionalParams: { maxValue },
	    });
	  }
	  return this;
	};

	/**
	 * Валидация: длины с указанным списком значений
	 * @param {object} props
	 * @param {array} props.listOfLengths
	 * @returns {this}
	 */
	predefinedListOfLength = ({ listOfLengths } = {}) => {
	  if (this.error || this.#shouldReturnEmptyError) return this;
	  if (!Array.isArray(listOfLengths) || listOfLengths.length === 0) return this;
	  if ((this.value) && !listOfLengths.includes(this.value.length)) {
	    this.#setNewError({
	      ...VALIDATION_ERRORS.predefinedListOfLength({ field: this.field, listOfLengths }),
	      additionalParams: { listOfLengths },
	    });
	  }
	  return this;
	};

	/**
   * Валидация: корректный емейл
   * @returns {this}
   */
	email = () => {
	  if (this.error || this.#shouldReturnEmptyError) return this;
	  if (!validator.isEmail(this.value)) {
	    this.#setNewError(VALIDATION_ERRORS.invalidEmailFormat({ field: this.field }));
	  }
	  return this;
	};

	/**
   * Валидация: формат пароля
   * @returns {this}
   */
	password = () => {
	  if (this.error || this.#shouldReturnEmptyError) return this;

	  // const patternNums = /[0-9]+/;
	  // const patternLowSyms = /[a-z]+/;
	  // const patternUppSyms = /[A-Z]+/;
	  // const patternMinLen = /.{8,}/;
	  // const isValid = (patternNums.test(this.value) && patternLowSyms.test(this.value)
	  // && patternUppSyms.test(this.value) && patternMinLen.test(this.value)); // eslint-disable-line max-len
	  const isValid = /^[0-9a-zA-Z~!@#$%^&*_\-+=`|(){}[\]:;"'<>,.?/]+$/.test(this.value);

	  if (!isValid) {
	    this.#setNewError(VALIDATION_ERRORS.isInvalidPasswordFormat({ field: this.field }));
	  }
	  return this;
	};

	/**
	 * Валидация: корректный телефон
	 * @returns {this}
	 */
	phone = () => {
	  if (this.error || this.#shouldReturnEmptyError) return this;
	  let isErrorDetected;
	  if (this.value && (!(/^\d+$/.test(this.value || '')) || this.value[0] !== '7')) {
	    isErrorDetected = true;
	    this.#setNewError({
	      ...VALIDATION_ERRORS.invalidPhoneFormat({ field: this.field, errorMessage: 'Invalid phone number' }),
	    });
	  }
	  if (!isErrorDetected && this.value.length < 11) {
	    this.#setNewError({
	      ...VALIDATION_ERRORS.invalidPhoneFormat({
	        field: this.field,
	        errorMessage: 'Not enough characters in the phone number',
	      }),
	    });
	  }
	  if (!isErrorDetected && this.value.length > 11) {
	    this.#setNewError({
	      ...VALIDATION_ERRORS.invalidPhoneFormat({
	        field: this.field,
	        errorMessage: 'Too many characters in the phone number',
	      }),
	    });
	  }
	  return this;
	};

	/**
	 * Валидация даты на формат и на вхождение в интервал
	 * @param {string|date} minDate - нижняя граница интервала
	 * @param {string|date} maxDate - верхняя граница интервала
	 * @returns {this}
	 */
	dateFormat = (minDate, maxDate) => {
	  if (this.error || this.#shouldReturnEmptyError) return this;

	  const testDate = (new Date(this.value)).getTime();
	  if (Number.isNaN(testDate)) {
	    this.#setNewError({
	      ...VALIDATION_ERRORS.invalidDateFormat({ field: this.field }),
	    });
	    return this;
	  }

	  const minDateTS = minDate ? (new Date(minDate)).getTime() : 0;
	  const maxDateTS = maxDate ? (new Date(maxDate)).getTime() : 0;

	  if (minDateTS && (minDateTS > testDate)) {
	    this.#setNewError({
	      ...VALIDATION_ERRORS.invalidDateFormat({ field: this.field, minDate }),
	    });
	  }

	  if (maxDateTS && (maxDateTS < testDate)) {
	    this.#setNewError({
	      ...VALIDATION_ERRORS.invalidDateFormat({ field: this.field, maxDate }),
	    });
	  }

	  return this;
	};

	/**
	 * Валидация: минимального кол-ва записей в массиве
	 * @param {number} minLength - минимальное количество
	 * @returns {this}
	 */
	arrayMinLength = ({ minLength }) => {
	  if (this.error || this.#shouldReturnEmptyError) return this;
	  if (Array.isArray(this.value) && this.value.length < minLength) {
	    this.#setNewError({
	      ...VALIDATION_ERRORS.arrayMinLength({ field: this.field, minLength }),
	      additionalParams: { minLength },
	    });
	  }
	  return this;
	};

	/**
	 * Валидация: максимального кол-ва записей в массиве
	 * @param {number} maxLength - максимальное количество
	 * @returns {this}
	 */
	arrayMaxLength = ({ maxLength }) => {
	  if (this.error || this.#shouldReturnEmptyError) return this;
	  if (Array.isArray(this.value) && this.value.length > maxLength) {
	    this.#setNewError({
	      ...VALIDATION_ERRORS.arrayMaxLength({ field: this.field, maxLength }),
	      additionalParams: { maxLength },
	    });
	  }
	  return this;
	};

	/**
	 * Валидация: максимального кол-ва записей в массиве
	 * @param {array} formats - список разрешенных форматов
	 * @returns {this}
	 */
	allowedFormats = (formats) => {
	  if (this.error || this.#shouldReturnEmptyError) { return this; }
	  if (!Array.isArray(formats) || formats.length === 0) { return this; }
	  if (!formats.includes(this.value.mimetype)) {
	    this.#setNewError({
	      ...VALIDATION_ERRORS.allowedFormats({ field: this.field, formats }),
	    });
	  }
	  return this;
	};
}
