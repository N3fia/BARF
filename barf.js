// Calculadora de Dieta BARF para perros (por ahora)
// Biologically Appropriate Raw Food

// para calcular las proporciones y composicion de la dieta BARF segun el caso especifico de cada perro necesitamos los siguientes parametros
//Nombre
//Edad : ingresada en años
//Peso actual: en kgs.
//Raza : chica / mediana / grande --> LO VOY A AGREGAR EN LA VERSION FINAL
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

alert("Bienvenido a la Calculadora BARF / Edicion Perros");

let perros = []; // array donde guardar los distintos perros ingresados, y poder buscar la info de los ya agregados

// calculo de porcentaje segun peso y edad para definir la porcion diaria en kilos. Los cachorros (perros menores de 1 año y medio, deben consuir al menos el 10% de su peso durante esta etapa)
// los perros adultos o seniors tienen una base de 2% de su peso a menos que la actividad sea alta.
// aca podriamos refinar aun mas haciendo variaciones entre peso y actividad..
function calcularDieta(peso, edad, actividad) {
	let porcentajeDiario;

	if (edad < 1.5) {
		porcentajeDiario = 0.1;
	} else if (actividad === "alto") {
		porcentajeDiario = 0.03;
	} else {
		porcentajeDiario = 0.02;
	}

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

function nuevoPerro() {
	let nombre = prompt("Nombre del perro:");
	let peso = parseFloat(prompt("Peso actual en kg:")); //el parseFloat ya que el peso puede tener decimales
	let edad = parseInt(prompt("Edad en años:"));
	let actividad = prompt(
		"Que tipo de actividad tiene tu mascota? ('bajo', 'medio', 'alto'):"
	);

	let porcionDia2 = calcularDieta(peso, edad, actividad);
	let ingredientes = porcentajeQueQuiero(porcionDia2);

	let perro = {
		nombre: nombre,
		peso: peso,
		edad: edad,
		queActividad: actividad,
		totalDia: porcionDia2,
		dietaCompuestaPor: ingredientes,
	};

	perros.push(perro);

	alert(`${nombre} se ha agregado correctamente!`);
}
console.log(perros);

// La idea en la entrega final es que en algun lado del HTML se vaya populando la lista de perror ingresados, de forma que sea mas facil para el usuario entender que se agrego y que no

function buscoPerro() {
	let nombreBusca = prompt(
		"Ingresa el nombre del perro que buscas(existentes): " +
			perros.map((p) => p.nombre)
	); // cambiar para que muestre una lista de los nombres en la entrega final

	let perroB = perros.find((d) => d.nombre === nombreBusca);

	if (perroB) {
		alert(
			`Nombre: ${perroB.nombre}\nPeso ${perroB.peso} kg\nEdad: ${
				perroB.edad
			} años\nTipo de actividad: ${
				perroB.queActividad
			}\nPeso de la porcion diaria: ${perroB.totalDia.toFixed(
				3
			)}kg\nLa dieta esta compuesta por:\n Cantidad de Hueso: ${perroB.dietaCompuestaPor.hueso.toFixed(
				2
			)} kg\n Cantidad de Carne: ${perroB.dietaCompuestaPor.carne.toFixed(
				2
			)} kg\n Cantidad de Vegetales: ${perroB.dietaCompuestaPor.vegetales.toFixed(
				2
			)} kg\n Cantidad de Semillas: ${perroB.dietaCompuestaPor.semillas.toFixed(
				2
			)} kg`
		);
	} else {
		alert("Ese perro no se ha ingresado aún");
	}
}

function calculadoraBarf() {
	let opcion;
	while (opcion !== 3) {
		opcion = prompt(`Que quieres hacer? (ingresa el numero de la opción)
            1 - Ingresar nuevo perro
            2 - Mostrar perro existente
            3 - Salir`);
		if (opcion === "1") {
			nuevoPerro();
		} else if (opcion === "2") {
			buscoPerro();
		} else if (opcion === "3") {
			alert("Adios!");
		} else {
			alert("Opción invalida, elige 1, 2 o 3");
		}
	}
}

calculadoraBarf();
