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

function createStoreInfo(data, collection, storeContainer) {
	const infoStore = createElementSingleClass('div', 'Brand-Inner');
	const name = createElementSingleClass('p', 'Brand-Name', data.name);
	const address = createElementSingleClass('p', 'Brand-Address', data.address);
	const link = createLink('Brand-LinkRedirection', data.link, 'Перейти в магазин');
	infoStore.appendChild(name);
	infoStore.appendChild(address);
	infoStore.appendChild(link);
	storeContainer.appendChild(infoStore);

	if (data.coordinates.length !== 0) {
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
		collection.add(placeMark);
		address.addEventListener('mouseenter', function () {
			placeMark.balloon.open();
		});
		address.addEventListener('mouseleave', function () {
			placeMark.balloon.close();
		});
	}
}

function createBrandInfo(data, collection, storeElement, city) {
	const oneStoreInfo = createElementSingleClass('div', 'Accord-Content');
	oneStoreInfo.classList.add('Brand-Content');
	for (let i = 0; i < data.length; i++) {
		createStoreInfo(data[i], collection, oneStoreInfo);
	}
	storeElement.appendChild(oneStoreInfo);
}

function createCityInfo(data, elementCity, collection) {
	//контейнер для одного города
	const oneCity = createElementSingleClass('div', 'Accord-Content');
	oneCity.classList.add('City-Content')
	//контейнер для аккордиона с брендами
	const oneStore = createElementSingleClass('div', 'Accord');
	oneStore.classList.add('Brand')
	for (let brand in data) {
		//console.log(brand);
		//console.log(data[brand][0].logo);
		const oneStoreElement = createElementSingleClass('div', 'Accord-Element');
		oneStoreElement.classList.add('Brand-Element')
		const onaeStoreLink = createLink('Accord-Link', '#', brand);
		onaeStoreLink.classList.add('Brand-Link')

		const brandLogo = createElementSingleClass('img', 'Brand-Logo');
		brandLogo.src = data[brand][0].logo;
		brandLogo.alt = brand;
		onaeStoreLink.appendChild(brandLogo);

		oneStoreElement.appendChild(onaeStoreLink);
		createBrandInfo(data[brand], collection, oneStoreElement);
		oneStore.appendChild(oneStoreElement);
	}

	oneCity.appendChild(oneStore);
	oneStore.MFSAccordeon({
		autoClose: true
	})
	elementCity.appendChild(oneCity);

}

function createCitiesList(city, data, map, citiesList) {
	//Создаем коллекцию для одного города
	let oneCityCollection = new ymaps.GeoObjectCollection(null, {});
	//Создаем блок для одного города, для создания аккордиона
	const accordElement = createElementSingleClass('div', 'Accord-Element');
	accordElement.classList.add('City-Element')
	//Название города
	const accordLink = createLink('Accord-Link', '#', city);
	accordLink.classList.add('City-Link')
	//Добавляем в блок название города
	accordElement.appendChild(accordLink);

	createCityInfo(data, accordElement, oneCityCollection);


	//Добавляем в глобальный блок - елемень с инфой по городу
	citiesList.appendChild(accordElement);
	accordLink.addEventListener('click', function () {
		if (!this.classList.contains('Accord-Link_Active')) {
			map.geoObjects.removeAll();
			map.geoObjects.add(oneCityCollection);
			//if (data.items.length === 1) {
			//	map.setBounds(map.geoObjects.getBounds());
			//	map.setZoom(14);
			//} else {
			map.setBounds(map.geoObjects.getBounds());
			map.setZoom(map.getZoom() - 1);
			//}

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
		//Обращаемся к яндексу для получения координат центра города в котором показываем информацию
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
