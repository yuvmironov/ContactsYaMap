'use strict'
ymaps.ready(createMap);

/**
 * Функция построения элемента телефона
 * @param phone - номер телефона для вставки
 * @param className - Имя класса для элемента телефона
 * @return {HTMLParagraphElement} - элемент для вставки в дом
 */
function phoneCreate(phone, className) {
	const phoneElement = document.createElement('p');
	phoneElement.className = className;
	phoneElement.innerText += phone;
	return phoneElement;
}

/**
 * Функция построения элемента графика работы
 * @param schedule - строка с графиком работы для вставки
 * @param className - класс для элемента графика работы
 * @return {HTMLParagraphElement} - элемент для вставки в дом
 */
function scheduleCreate(schedule, className) {
	const phoneElement = document.createElement('p');
	phoneElement.className = className;
	phoneElement.innerText += schedule;
	return phoneElement;
}

/**
 * Функция для создания элемента карты с одним классом
 * @param teg - Необходимый тег
 * @param className - Имя класса
 * @param inner - Содержимое тега
 * @return {HTMLElement | HTMLSelectElement | HTMLLegendElement | HTMLTableCaptionElement | HTMLTextAreaElement | HTMLModElement | HTMLHRElement | HTMLOutputElement | HTMLPreElement | HTMLEmbedElement | HTMLCanvasElement | HTMLFrameSetElement | HTMLMarqueeElement | HTMLScriptElement | HTMLInputElement | HTMLUnknownElement | HTMLMetaElement | HTMLStyleElement | HTMLObjectElement | HTMLTemplateElement | MSHTMLWebViewElement | HTMLBRElement | HTMLAudioElement | HTMLIFrameElement | HTMLMapElement | HTMLTableElement | HTMLAnchorElement | HTMLMenuElement | HTMLPictureElement | HTMLParagraphElement | HTMLTableDataCellElement | HTMLTableSectionElement | HTMLQuoteElement | HTMLTableHeaderCellElement | HTMLProgressElement | HTMLLIElement | HTMLTableRowElement | HTMLFontElement | HTMLSpanElement | HTMLTableColElement | HTMLOptGroupElement | HTMLDataElement | HTMLDListElement | HTMLFieldSetElement | HTMLSourceElement | HTMLBodyElement | HTMLDirectoryElement | HTMLDivElement | HTMLUListElement | HTMLHtmlElement | HTMLAreaElement | HTMLMeterElement | HTMLAppletElement | HTMLFrameElement | HTMLOptionElement | HTMLImageElement | HTMLLinkElement | HTMLHeadingElement | HTMLVideoElement | HTMLBaseFontElement | HTMLTitleElement | HTMLButtonElement | HTMLHeadElement | HTMLParamElement | HTMLTrackElement | HTMLOListElement | HTMLDataListElement | HTMLLabelElement | HTMLFormElement | HTMLTimeElement | HTMLBaseElement}
 */
function createElementSingleClass(teg, className = '', inner = '') {
	const element = document.createElement(teg);
	element.className = className;
	element.innerText = inner;
	return element;
}

/**
 * Функция для создания ссылки
 * @param className - класс
 * @param hrefLink - значение атирибута href
 * @param inner - Текст для отображения
 * @return {HTMLAnchorElement} - готовый элемент ссылки для вставки
 */
function createLink(className, hrefLink, inner) {
	const link = document.createElement('a');
	const text = document.createTextNode(inner);
	link.className = className;
	link.href = hrefLink;
	link.appendChild(text);
	return link;
}

/**
 * Функция для построения информации по одному адресу
 * @param data - данные по одному адресу
 * @param collection - коллекция Yandex карт для добовления меток
 * @param storeContainer - контейнер для добовления адреса
 */
function createStoreInfo(data, collection, storeContainer) {
	//Блок для одного адреса
	const infoStore = createElementSingleClass('div', 'Brand-Inner');
	//Название магазина
	const name = createElementSingleClass('p', 'Brand-Name', data.name);
	//Адрес магазина
	const address = createElementSingleClass('p', 'Brand-Address', data.address);
	//Линк на интрнет магазин
	const link = createLink('Brand-LinkRedirection', data.link, 'Перейти в магазин');
	//Собираем все в кучу
	infoStore.appendChild(name);
	infoStore.appendChild(address);
	infoStore.appendChild(link);
	//Добавляем в блок для магазина
	storeContainer.appendChild(infoStore);
	
	//Если координаты пусты, то метку на карту не ставим (актуально для адресов АРМЕД в городах кроме москвы)
	if (data.coordinates.length !== 0) {
		//Создаем метку
		let placeMark = new ymaps.Placemark(
			data.coordinates, {
				hintContent: data.name,
				balloonContentHeader: data.name,
				balloonContentBody: data.address,
				balloonContentFooter: `<a href="${data.link}">перейти в магазин</a>`
			}, {
				iconLayout: 'default#image',
				iconImageHref: data.iconImageHref,
				iconImageSize: data.iconImageSize,
				iconImageOffset: data.iconImageOffset,
				hideIconOnBalloonOpen: false
			});
		//Добавляем метку в коллекцию
		collection.add(placeMark);
		//Обработчик открытия балуна по наведению на адрес (можно повестиь данный обработчик на любой элемент из текущей функции)
		address.addEventListener('mouseenter', function () {
			placeMark.balloon.open();
		});
		address.addEventListener('mouseleave', function () {
			placeMark.balloon.close();
		});
	}
}

/**
 * Функция создания информации по одному бренду
 * @param data - данные по бренду
 * @param collection - коллекция для добавления меток (проброс в следующую функцию)
 * @param storeElement - блок для добавления информации по бренду
 */
function createBrandInfo(data, collection, storeElement) {
	//Создаем блок для одного магазина
	const oneStoreInfo = createElementSingleClass('div', 'Accord-Content');
	oneStoreInfo.classList.add('Brand-Content');
	for (let i = 0; i < data.length; i++) {
		//Добавляем магазины
		createStoreInfo(data[i], collection, oneStoreInfo);
	}
	//Добавляем информацию для бренда
	storeElement.appendChild(oneStoreInfo);
}

/**
 * Функция для создания информации по одному городу
 * @param data - данные для работы
 * @param elementCity - блок для вставки информации
 * @param collection - коллекция для меток (проброс в следующую функцию)
 */
function createCityInfo(data, elementCity, collection) {
	//контейнер для одного города
	const oneCity = createElementSingleClass('div', 'Accord-Content');
	oneCity.classList.add('City-Content');
	//контейнер для аккордиона с брендами
	const oneStore = createElementSingleClass('div', 'Accord');
	oneStore.classList.add('Brand');
	//Создаем информацию по брендам в городе
	for (let brand in data) {
		const oneStoreElement = createElementSingleClass('div', 'Accord-Element');
		oneStoreElement.classList.add('Brand-Element');
		const oneStoreLink = createLink('Accord-Link', '#', brand);
		oneStoreLink.classList.add('Brand-Link');
		const brandLogo = createElementSingleClass('img', 'Brand-Logo');
		brandLogo.src = data[brand][0].logo;
		brandLogo.alt = brand;
		oneStoreLink.appendChild(brandLogo);
		oneStoreElement.appendChild(oneStoreLink);
		createBrandInfo(data[brand], collection, oneStoreElement);
		oneStore.appendChild(oneStoreElement);
	}

	oneCity.appendChild(oneStore);
	oneStore.MFSAccordeon({
		autoClose: true
	});
	elementCity.appendChild(oneCity);

}

/**
 * Функция для создания города
 * @param city - название города
 * @param data - данные для обработки
 * @param map - ссылка на карту, для добвления коллекции с метками
 * @param citiesList - блок для вставки созданной информации
 */
function createCitiesList(city, data, map, citiesList) {
	//Создаем коллекцию для одного города
	let oneCityCollection = new ymaps.GeoObjectCollection(null, {});
	//Создаем блок для одного города, для создания аккордиона
	const accordElement = createElementSingleClass('div', 'Accord-Element');
	accordElement.classList.add('City-Element');
	//Название города
	const accordLink = createLink('Accord-Link', '#', city);
	accordLink.classList.add('City-Link');
	//Добавляем в блок название города
	accordElement.appendChild(accordLink);
	createCityInfo(data, accordElement, oneCityCollection);
	//Добавляем в глобальный блок - елемень с инфой по городу
	citiesList.appendChild(accordElement);
	//Добавляем обработчик клика по названию города (при активном городе показываем коллекцию меток, при не активном убираем все коллекции с карты)
	accordLink.addEventListener('click', function () {
		if (!this.classList.contains('Accord-Link_Active')) {
			map.geoObjects.removeAll();
			map.geoObjects.add(oneCityCollection);
			map.setBounds(map.geoObjects.getBounds());
			map.setZoom(map.getZoom() - 1);
		} else {
			map.geoObjects.removeAll();
		}
	});

	//map.geoObjects.add(oneCityCollection);


}

/**
 * Функция инициализации и построения карты
 */
function createMap() {
	//Получение данных для обработки
	$.getJSON('MapSource.json', (dataMap) => {
		//Инициализируем карту с координатами в центре москвы
		let myMap = new ymaps.Map(
			'Map', {
				center: [55.7491, 37.6210],
				zoom: 10,
				controls: ['zoomControl', 'fullscreenControl'],
				behaviors: ['drag', 'dblClickZoom']
			}, {
				searchControlProvider: 'yandex#search'
			}
		);
		const citiesListBlock = createElementSingleClass('div', 'Accord');
		citiesListBlock.id = 'Cities';
		citiesListBlock.classList.add('City');
		for (let city in dataMap) {
			createCitiesList(city, dataMap[city], myMap, citiesListBlock)
		}
		//Получаем блок для добавления информции по городам и добавляем туда всю информацию
		citiesListBlock.MFSAccordeon({
			autoClose: true
		});
		const dataGlobalBlock = document.getElementById('DescMap');
		dataGlobalBlock.appendChild(citiesListBlock);
	});
	console.groupEnd();
}
