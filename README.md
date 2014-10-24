# Aquila Client

Biblioteca para aplicaciones cliente de la API Aquila.
Facilita la creación de aplicaciones que consuman esta API.

## Funcionalidades

- Permite conectarse a un hub Aquila con usuario y contraseña.
- Listar los dispositivos en la red Aquila, así como filtrarlos por clase, nombre, dirección e id.
- Ejecutar acciones en cualquier dispositivo.
- Escuchar eventos de cualquier dispositivo e inscribir funciones a éstos.
- Obtener y modificar la PAN de la red del hub.
- Ordenar al hub a que recargue o descubra nuevos dispositivos.

## Instalación

Próximamente estará en npm.

## Uso

```
var Aquila = require("aquila");
// specify your hub url
aq = new Aquila("http://localhost:8080");

// make connection and login
aq.login("Your Username", "Your secure password", function(err)
	{
		// attend any error on connection
		if(err) return console.log(err.message);

		// do your stuff...

		var things;

		// get all devices
		things = aq.devices();
		// filter by name
		things = aq.devices("#Device Name");
		// filter by class
		things = aq.devices(".mx.makerlab.deviceClass");
		// filter by address
		things = aq.devices([252,194,61,0,0,5,178,228]);
		// filter by id
		things = aq.devices("544987f20e027eb259a88a6f");

		// execute action by number
		things.action(0);
		// execute action by name, with param 255
		things.action("Turn On", 255);

		// subscribe function to an event
		things.on("Button Pressed", function(param) {
				console.log("Got event 'Button Pressed' with param ", param);
			});

		// discover nearby devices
		aq.discover();

		// reload all devices
		aq.reload();

		// get PAN
		aq.getPAN(function(err, pan){
				console.log(pan);
			});

		// set PAN
		var newPAN = 0xCA5A;
		aq.setPAN(newPAN, function(err, pan) {
				if(err) console.log("Error setting PAN");
				console.log("PAN set OK and is now: ", pan);
			});
	});
```

## Métodos

### aq.login(user, password, callback)

Realiza la conexión con el hub y llama a callback al terminar, pasándole como parámetro un error en caso de haberlo.

Nota: no se debe usar ninguna otra función de esta biblioteca sin antes haber realizado la conexión.

### aq.devices(filter)

retorna una especie de arreglo especial con dispositivos según el filtro usado.

Sintaxis del filtro:

- Si no hay filtro, o es "*", se retornan todos los dispositivos.
- Si el filtro empieza con "#", se busca por nombre.
- Si el filtro empieza con ".", se busca por clase.
- Si el filtro es un arreglo, se busca por dirección.
- Si el filtro es un string y ninguno de los anteriores, se busca por id.

### dispositivo.action(action, param)

Ejecuta una acción en uno o varios dispositivos (el objeto retornado por aq.devices()).

- action puede ser un número de acción o su nombre.
- param es opcional y es un número de 0 a 255.

### dispositivo.on(event, function)

Inscribe una función a un evento.

- event es el nombre del evento.
- function recibe param, que puede ser null o un número de 0 a 255.

### aq.discover(callback)

Empieza a descubrir dispositivos cercanos. Al terminar, ejecuta callback.

### aq.reload(callback)

Olvida todo y empieza a descubrir dispositivos cercanos. Al terminar, ejecuta callback.

### aq.getPAN(callback)

Obtiene la PAN del hub y ejecuta callback con err (error, si hay) y pan.

### aq.setPAN(pan, callback)

Cambia la PAN del hub y ejecuta callback con err (error, si hay) y pan.
