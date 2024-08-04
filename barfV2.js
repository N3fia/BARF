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

function calcularDieta(peso, edad, actividad) {
	// let porcentajeDiario;

	// if (edad < 1.5) {
	// 	porcentajeDiario = 0.1;
	// } else if (actividad === "alto") {
	// 	porcentajeDiario = 0.03;
	// } else {
	// 	porcentajeDiario = 0.02;
	// }

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

// function nuevoPerro() {
// 	let nombre = prompt("Nombre del perro:");
// 	let peso = parseFloat(prompt("Peso actual en kg:")); //el parseFloat ya que el peso puede tener decimales
// 	let edad = parseInt(prompt("Edad en años:"));
// 	let actividad = prompt(
// 		"Que tipo de actividad tiene tu mascota? ('bajo', 'medio', 'alto'):"
// 	);

// 	let porcionDia2 = calcularDieta(peso, edad, actividad);
// 	let ingredientes = porcentajeQueQuiero(porcionDia2);

// 	let perro = {
// 		nombre: nombre,
// 		peso: peso,
// 		edad: edad,
// 		queActividad: actividad,
// 		totalDia: porcionDia2,
// 		dietaCompuestaPor: ingredientes,
// 	};

// 	perros.push(perro);

// funcion nuevo perro reemplazada para tomar los datos desde los inputs de las forms

//Capitalizacion del nombre del perro
function capitalizarPrimeraLetra(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

document.getElementById("datos").addEventListener("submit", function (event) {
	event.preventDefault(); //Entiendo que con esto evito que la pagina haga reload..no se si lo aplique bien

	let nombre = document
		.querySelector('input[name="nombre"]')
		.value.toLowerCase(); // conversin a minusculas del nombre del perro
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
	crearAvatarPerro(perro);

	alert(`${nombreCapitalizado} se ha agregado correctamente!`);
	event.target.reset();
});

// 	alert(`${nombre} se ha agregado correctamente!`);
// }
// console.log(perros);

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

//La funcion Busco perros va a quedar obsoleta una vez que los perros se muestren como avatar en la seccion mis perros, la busqueda se replazaria por un click en la ui

// function buscoPerro() {
// 	let nombreBusca = prompt(
// 		"Ingresa el nombre del perro que buscas(existentes): " +
// 			perros.map((p) => p.nombre)
// 	); // cambiar para que muestre una lista de los nombres en la entrega final

// 	let perroB = perros.find((d) => d.nombre === nombreBusca);

// 	if (perroB) {
// 		alert(
// 			`Nombre: ${perroB.nombre}\nPeso ${perroB.peso} kg\nEdad: ${
// 				perroB.edad
// 			} años\nTipo de actividad: ${
// 				perroB.queActividad
// 			}\nPeso de la porcion diaria: ${perroB.totalDia.toFixed(
// 				3
// 			)}kg\nLa dieta esta compuesta por:\n Cantidad de Hueso: ${perroB.dietaCompuestaPor.hueso.toFixed(
// 				2
// 			)} kg\n Cantidad de Carne: ${perroB.dietaCompuestaPor.carne.toFixed(
// 				2
// 			)} kg\n Cantidad de Vegetales: ${perroB.dietaCompuestaPor.vegetales.toFixed(
// 				2
// 			)} kg\n Cantidad de Semillas: ${perroB.dietaCompuestaPor.semillas.toFixed(
// 				2
// 			)} kg`
// 		);
// 	} else {
// 		alert("Ese perro no se ha ingresado aún");
// 	}
// }
// SUBSTITUCION DE AGREGAR PERRO PARA QUE CREE EL EVATAR CON EL NOMBRE
function crearAvatarPerro(perro, index) {
	const avatarContainer = document.createElement("div");
	avatarContainer.classList.add("avatar-container");

	const avatar = document.createElement("div");
	avatar.classList.add("avatar");

	const avatarImg = document.createElement("img");
	avatarImg.src = "./assets/adult.png"; // Placeholder image
	avatarImg.alt = "Avatar Perro";
	avatar.appendChild(avatarImg);

	const avatarName = document.createElement("div");
	avatarName.classList.add("avatar-name");
	avatarName.innerText = perro.nombre;

	const deleteButton = document.createElement("button");
	deleteButton.innerText = "Borrar";
	deleteButton.classList.add("delete-button");
	deleteButton.addEventListener("click", function () {
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
	perros.splice(index, 1); // para eliminar el perro del array
	sessionStorage.setItem("perros", JSON.stringify(perros));

	document.getElementById("misperros").innerHTML = "";
	perros.array.forEach(crearAvatarPerro);
}

perros.forEach(crearAvatarPerro);

// esta funcion tambien va aquedar obsoleta cuando los datos sean tomados desde los inputs de la form
// function calculadoraBarf() {
// 	let opcion;
// 	while (opcion !== 3) {
// 		opcion = prompt(`Que quieres hacer? (ingresa el numero de la opción)
//             1 - Ingresar nuevo perro
//             2 - Mostrar perro existente
//             3 - Salir`);
// 		if (opcion === "1") {
// 			nuevoPerro();
// 		} else if (opcion === "2") {
// 			buscoPerro();
// 		} else if (opcion === "3") {
// 			alert("Adios!");
// 		} else {
// 			alert("Opción invalida, elige 1, 2 o 3");
// 		}
// 	}
// }

// calculadoraBarf();
