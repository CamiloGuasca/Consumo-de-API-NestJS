Esta es una API muy sencilla solo de ejercicio. En esta se consume otra API https://swapi.dev/ que es sobre cosas de starwars.

De la API externa solo se traen los datos y el resto de funcionalidades funcionan localmente mediante arrays. Cuenta con las siguientes carateristicas:


GET | /personajes | Lista todos los personajes (SWAPI + Locales). Soporta paginación: /personajes?limit=10&offset=0.


GET | /personajes/:id | Busca un personaje por uid. Busca primero localmente y luego en SWAPI.

POST | /personajes | Crea un nuevo personaje y lo almacena localmente.

PATCH | /personajes/:id | Actualiza parcialmente un personaje existente (solo funciona para personajes creados localmente).

DELETE | /personajes/:id | Elimina un personaje existente (solo funciona para personajes creados localmente).


