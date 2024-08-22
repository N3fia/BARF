// Calculadora de Dieta BARF para perros (por ahora)
// Biologically Appropriate Raw Food

// para calcular las proporciones y composicion de la dieta BARF segun el caso especifico de cada perro necesitamos los siguientes parametros
//Nombre
//Edad : ingresada en años
//Peso actual: en kgs.
//Actividad : bajo/ medio / alto (dependiendo de las horas activas al dia)

// Calculo
// calculo base % del peso total dependiendo del peso actual la edad y el nivel de actividad
// ejemplo
//Nombre: Kona
//Edad: Adulto
//Peso Actual: 32kg
//Peso ideal: 32kg
//Condicion fisica: pobre / buena / morbida (la condicion fisica varia dependiendo de si el perro necesita subir o bajar de peso, se caclula usando el peso actual y el peso ideal) --> LO SAQUE del criterio en esta oportunidad, lo voy a agregar en el proyecto finalse define si el peso ideal es mayo o menor al peso actual
//Actividad: Alta / Media / Baja

// NOTA . PARA LA ENTREGA 2 ESTOY USANDO PROMPTS Y ALERTS, la idea del proyecto final es que los datos sean ingresados a traves de una form y los resultados se muestren en una tarjeta.
//Cuando haya mas de 1 perro ingresado, tambien se va a mostrar la lista de las entradas ya hechas con la fecha en la cual se crearon y al seleccionarla se mostraria la tarjeta correspondiente.

let perros = JSON.parse(sessionStorage.getItem("perros")) || []; // array donde guardar los distintos perros ingresados, y poder buscar la info de los ya agregados con el sessionStorage

document.addEventListener("DOMContentLoaded", function () {
	fetch("./perros_lista.json")
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			const select = document.getElementById("perro-select");
			data.forEach((perro, index) => {
				const option = document.createElement("option");
				option.value = index;
				option.textContent = perro.nombre;
				option.dataset.perro = JSON.stringify(perro);
				select.appendChild(option);
			});
		})
		.catch((error) => {
			console.error("Error cargando archivo JASON", error);
		});
});

document.getElementById("perro-select").addEventListener("change", function () {
	const selectedOption = this.options[this.selectedIndex];
	const perro = JSON.parse(selectedOption.dataset.perro);

	let porcionDia2 = calcularDieta(perro.peso, perro.edad, perro.actividad);
	let ingredientes = porcentajeQueQuiero(porcionDia2);
	perro.totalDia = porcionDia2;
	perro.dietaCompuestaPor = ingredientes;

	displayResultados(perro);
	crearAvatarPerro(perro, perros.length);

	perros.push(perro);
	sessionStorage.setItem("perros", JSON.stringify(perros));
});

document.getElementById("datos").addEventListener("submit", function (event) {
	event.preventDefault();
	let nombre = document
		.querySelector('input[name="nombre"]')
		.value.toLowerCase();
	let nombreCapitalizado = capitalizarPrimeraLetra(nombre);
	let peso = parseFloat(document.querySelector('input[name="peso"]').value);
	let edad = parseInt(document.querySelector('input[name="edad"]').value);
	let actividad = document.querySelector('select[name="actividad"]').value;
	let porcionDia2 = calcularDieta(peso, edad, actividad);
	let ingredientes = porcentajeQueQuiero(porcionDia2);

	let perro = {
		nombre: nombreCapitalizado,
		peso: peso,
		edad: edad,
		queActividad: actividad,
		totalDia: porcionDia2,
		dietaCompuestaPor: ingredientes,
	};

	perros.push(perro);
	sessionStorage.setItem("perros", JSON.stringify(perros));
	displayResultados(perro);

	actualizarAvataresPerros();

	Swal.fire({
		title: `${nombreCapitalizado} se ha agregado correctamente!`,
		icon: "success",
		showConfirmButton: false,
		position: "center",
		timer: 1500,
	});

	event.target.reset();
});

function calcularDieta(peso, edad, actividad) {
	let porcentajeDiario =
		edad < 1.5
			? 0.1
			: edad > 7
			? actividad === "bajo"
				? 0.02
				: 0.03
			: actividad === "alto"
			? 0.03
			: 0.02;

	let porcionDia = peso * porcentajeDiario;
	return porcionDia;
}

// con el resultado de calculadoraDieta, que seria porcionDia, calculamos el porcentaje de cada ingrediente base
function porcentajeQueQuiero(porcionDia) {
	let porcentajeHueso = 0.4;
	let porcentajeCarne = 0.4;
	let porcentajeVegetales = 0.15;
	let porcentajeSemillas = 0.05;

	let totalHueso = porcionDia * porcentajeHueso;
	let totalCarne = porcionDia * porcentajeCarne;
	let totalVegetales = porcionDia * porcentajeVegetales;
	let totalSemillas = porcionDia * porcentajeSemillas;

	return {
		hueso: totalHueso,
		carne: totalCarne,
		vegetales: totalVegetales,
		semillas: totalSemillas,
	};
}

//Capitalizacion del nombre del perro
function capitalizarPrimeraLetra(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

//voy a convertir esto en una funcion para procesar formulario y asi poder usarlo en lugar de la funcion anonima del eveno submit para la entrega final... ahora no puedo pensar mas xD
// document.getElementById("datos").addEventListener("submit", function (event) {
// 	event.preventDefault(); //Entiendo que con esto evito que la pagina haga reload..no se si lo aplique bien pero funciona =)

//MOSTRAR DATOS DE LA FORM EN LA SECCION  RESULTADOS
function displayResultados(perro) {
	document.querySelector(
		".resultado h3"
	).innerText = `Receta para "${perro.nombre}"`;
	document.querySelector(
		".resultado p:nth-of-type(1)"
	).innerText = `Peso: ${perro.peso} kg`;
	document.querySelector(
		".resultado p:nth-of-type(2)"
	).innerText = `Edad: ${perro.edad} años`;
	document.querySelector(
		".resultado p:nth-of-type(3)"
	).innerText = `Actividad: ${perro.queActividad}`;
	document.querySelector(
		".resultado p:nth-of-type(4)"
	).innerText = `Peso de la porcion diaria: ${perro.totalDia.toFixed(2)} kg`;
	document.querySelector(
		".resultado ul li:nth-of-type(1)"
	).innerText = `Huesos Carnosos: ${perro.dietaCompuestaPor.hueso.toFixed(
		3
	)} kg`;
	document.querySelector(
		".resultado ul li:nth-of-type(2)"
	).innerText = `Carne Muscular: ${perro.dietaCompuestaPor.carne.toFixed(
		3
	)} kg`;
	document.querySelector(
		".resultado ul li:nth-of-type(3)"
	).innerText = `Vegetales: ${perro.dietaCompuestaPor.vegetales.toFixed(3)} kg`;
	document.querySelector(
		".resultado ul li:nth-of-type(4)"
	).innerText = `Semillas: ${perro.dietaCompuestaPor.semillas.toFixed(3)} kg`;
}

// SUBSTITUCION DE AGREGAR PERRO PARA QUE CREE EL EVATAR CON EL NOMBRE
function crearAvatarPerro(perro, index) {
	const avatarContainer = document.createElement("div");
	avatarContainer.classList.add("avatar-container");

	const avatar = document.createElement("div");
	avatar.classList.add("avatar");

	const avatarImg = document.createElement("img");
	switch (true) {
		case perro.edad < 1.5:
			avatarImg.src = "./assets/puppy.png";
			break;
		case perro.edad >= 1.5 && perro.edad <= 7:
			avatarImg.src = "./assets/adult.png";
			break;
		case perro.edad > 7:
			avatarImg.src = "./assets/senior.png";
			break;
		default:
			avatarImg.src = "./assets/adult.png";
			break;
	}

	// avatarImg.src = "./assets/adult.png";
	avatarImg.alt = "Avatar Perro";
	avatar.appendChild(avatarImg);

	const avatarName = document.createElement("div");
	avatarName.classList.add("avatar-name");
	avatarName.innerText = perro.nombre;

	const deleteButton = document.createElement("button");
	deleteButton.innerText = "Borrar";
	deleteButton.classList.add("delete-button");
	deleteButton.addEventListener("click", function (event) {
		event.stopPropagation(); // la idea es evitar que se dispare el click al borrar, pero no se si con preventDefault hubiese alcanzado
		eliminarPerro(index);
	});

	avatarContainer.appendChild(avatar);
	avatarContainer.appendChild(avatarName);
	avatarContainer.appendChild(deleteButton);

	// SUBSTITUCION DE BUSCAR PERRO PARA HACER CLICK EN PERRO EN LUGAR DE BUSCAR POR NOMBRE
	avatarContainer.addEventListener("click", function () {
		displayResultados(perro);
	});

	document.getElementById("misperros").appendChild(avatarContainer);
}

function eliminarPerro(index) {
	const perroEliminado = perros[index].nombre;
	perros.splice(index, 1);
	sessionStorage.setItem("perros", JSON.stringify(perros));
	actualizarAvataresPerros();

	Swal.fire({
		title: `${perroEliminado} ha sido borrado de "Mis Perros"`,
		icon: "info",
		toast: true,
		position: "top-end",
		showConfirmButton: false,
		timer: 1500,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener("mouseenter", Swal.stopTimer);
			toast.addEventListener("mouseleave", Swal.resumeTimer);
		},
	});
}

function actualizarAvataresPerros() {
	const container = document.getElementById("misperros");
	container.innerHTML = "";
	perros.forEach((perro, index) => crearAvatarPerro(perro, index));
}

perros.forEach(crearAvatarPerro);
