const canWrap = document.getElementById('canvas_wrap');
const listWrap = document.getElementById('list_wrap');
const container = document.getElementById('container');
const btn = document.getElementById('btn');
const input = document.getElementById('getFile');
const list = document.getElementById('list');

let imgW = 200, // ширина картинки
	imgH = 200, // высота картинки
	coordX = 0, // координата Х
	coordY = 0, // координата У
	widthList = listWrap.offsetWidth, // ширина списка картинок
	canWrapWidth, // ширина оболочки канвас
	canWidth; // ширина канвас

let imgList = []; // масив картинок

class ImageBrowse {
	// получение картинки которую выбрал пользователь
	browse() {
		let input = document.getElementById('getFile');
		let files = {};

		files = input.files;
		//console.log(files[0]);
		return files[0];
	}
}

class ImageItem {
	// конструктор экземпляра объекта
	constructor(imageFile) {
		this.imageFile = imageFile;
	}

	// возвращает имя картинки
	get getName() {
		return this.imageFile.name;
	}

	// проверят выбраный файл на тип "img" и возвращает картинку
	get getImage() {
		if (this.imageFile.type.indexOf('image') != -1) {
			let img = new Image();
			// img.onload = function() {};

			let url = URL.createObjectURL(this.imageFile);
			img.src = url;

			return img;
		} else {
			// console.log(null);
			return null;
		}
	}
}

class ImageRender {
	// возвращает элемент канвас
	getCanvas() {
		return document.getElementById('canv');
	}

	// очищает канвас
	clearCanvas() {
		let canv = this.getCanvas();
		let ctx = canv.getContext('2d');
		ctx.clearRect(0, 0, canv.width, canv.height);
	}

	// отрисовует список имен картинок
	addImage(arr) {
		while (list.firstChild) {
			list.removeChild(list.firstChild);
		}
		// console.log(list.firstChild);
		arr.forEach(function(item, index) {
			// console.log(item.getName);
			let li = document.createElement('li');
			li.innerHTML = item.getName;
			li.id = index;
			li.className = 'list--item';
			list.appendChild(li);
		});
	}
}

function clicker() {
	// выполняется после выбора картинки пользователем
	console.clear();
	let img = new ImageBrowse().browse();
	let imgIt = new ImageItem(img);
	let render = new ImageRender();
	if (imgIt.getImage) {
		imgList.push(imgIt);
	}

	buildCanvas(imgList);
	render.addImage(imgList);
	paint(imgList, render);
}

function resizeF() {
	// отслеживание изменений ширины окна и перересовка канвас
	let render = new ImageRender();

	buildCanvas(imgList);
	render.addImage(imgList);
	paint(imgList, render);
}

function removeItem(event) {
	// удаляет картинку из списка и перересовка канвас
	let newArr = imgList.filter(function(item, i) {
		return i != +event.target.id;
	});
	imgList = newArr;
	let render = new ImageRender();
	render.addImage(imgList);
	buildCanvas(imgList);
	paint(imgList, render);
}

function paint(arr, render) {
	// отрисовка масива изобрахений
	let x = coordX;
	let y = coordY;
	render.clearCanvas();
	arr.forEach(function(item, index) {
		let canv = render.getCanvas();
		let ctx = canv.getContext('2d');
		let pic = new Image();
		let quantityPic = Math.floor(canWrapWidth / imgW);
		console.log('index % quantityPic ' + (index % quantityPic));

		pic.addEventListener('load', function() {
			if (index % quantityPic == 0 && index != 0) {
				x = 0;
				y += imgH + 10;
			}
			ctx.drawImage(pic, x, y, imgW, imgH);
			console.log('drawImage ' + x, y, imgW, imgH);
			x += imgW + 10;
		});
		pic.src = item.getImage.src;
	});
}

function buildCanvas(arr) {
	let heightCanv = 200; // высота канвас
	canWrapWidth = container.offsetWidth - widthList - 1;
	canWidth = canWrapWidth;
	let odds = Math.floor(canWrapWidth / imgW); // количество картинок в строке
	let odds2 = Math.floor(arr.length / odds) + 1; // количество строк
	if (odds2 > 1) {
		heightCanv = heightCanv * odds2 + (odds2 - 1) * 10; // высота канвас если строк больше 1
	}

	canWrap.style.width = `${canWrapWidth}`;
	canWrap.style.height = `${heightCanv}`;

	canWrap.innerHTML = `<canvas id="canv" height="${heightCanv}px" width="${canWidth}px"></canvas>`;
}

btn.onclick = function() {
	let event = new MouseEvent('click');
	input.dispatchEvent(event);
};

window.addEventListener('resize', resizeF);

getFile.addEventListener('change', clicker);

list.addEventListener('click', removeItem);
