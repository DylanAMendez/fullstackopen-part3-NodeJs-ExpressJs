const express = require('express');

const app = express();

//? acceder a los datos fácilmente, con json-parser de express
app.use(express.json())

let notes = [
  {
    id: 1,
    content: 'HTML is easy',
    date: '2019-05-30T17:30:31.098Z',
    important: true,
  },
  {
    id: 2,
    content: 'Browser can execute only Javascript',
    date: '2019-05-30T18:39:34.091Z',
    important: false,
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true,
  },
];

//* enviar texto html
app
  .get('/', (request, response) =>
  {
    response.send('<h1>Hello World</h1>');
  });

//* obtener todos valores dentro de notes[]
app
  .get('/api/notes', (request, response) =>
  {
    response.json(notes);
  });

//* obtener id especifico
app
  .get('/api/notes/:id', (request, response) =>
  {
    const id = Number(request.params.id);
    console.log(id);

    const note = notes.find(note => note.id === id)

    if (note) {
      response.json(note);
    }
    else {
      response.status(404).end();
    }

    console.log(note);

  });

//* Eliminar recursos con id especifico
app
  .delete('/api/notes/:id', (request, response) =>
  {
    const id = Number(request.params.id);

    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
  })

//* agregar nuevas notas al servidor
app
  .post('/api/notes', (request, response) =>
  {
    const note = request.body
    console.log(note);

    response.json(note)
  })


//* finalizar el manejo de la solicitud
app
  .post('/api/notes', (request, response) =>
  {
    const body = response.body

    if (!body.content) {
      return response
        .status(400)
        .json(
          {
            error: 'content missing'
          })
    }

    const note =
    {
      content: body.content,
      important: body.important || false,
      date: new Date(),
      id: generateId(),
    }

    notes = notes.concat(note)

    response.json(note)
  })


//* Mejoremos la aplicación definiendo que la propiedad content no puede estar vacía. 
//* Las propiedades important y date recibirán valores predeterminados. las demás se descartan
const generateId = () => 
{
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}


const PORT = 3001;

app.listen(PORT, () =>
{
  console.log(`Server running on port ${PORT}`);
});
