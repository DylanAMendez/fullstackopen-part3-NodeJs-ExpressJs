const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())

morgan.token('all-methods', (req, res) =>
{
  if (req.method === 'GET' || req.method === 'POST' || req.method === 'DELETE') {
    return JSON.stringify(req.query);
  }
  return '';
});

morgan.token('params-data', (req, res) =>
{
  if (req.method === 'GET') {
    return JSON.stringify(req.params);
  }
  return '';
});



app.use(morgan(':method :url :status :response-time ms - :res[content-length] :all-methods'))

let persons = [
  {
    id: 1,
    name: "Arthur Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abraham",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Pop",
    number: "39-23-6423122"
  },
]

//* OBTENER ALL PERSONS
app
  .get('/api/persons', (request, response) =>
  {
    response.json(persons)
  })

//* OBTENER INFO
app
  .get('/api/info', (request, response) =>
  {
    const entradasAgenda = persons.length
    const dateNow = new Date()
    response.send(`<p>Phonebook has info for ${entradasAgenda} people</p> <p>${dateNow}</p>`)
  })

//* OBTENER con ID especifico
app
  .get('/api/persons/:id', (request, response) =>
  {
    const id = Number(request.params.id)

    const person = persons.find(p => p.id === id) //? retorna el objeto entero

    if (person) {
      response.json(person)
    }
    else {
      response.status(404).end()
    }

    console.log(person);
  })


//* eliminar con ID especifico
app
  .delete('/api/persons/:id', (request, response) =>
  {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
  })

//? función GENERAR ID AUTO
const generateId = () =>
{
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}


//* ADD new PERSON
app
  .post('/api/persons', (request, response) =>
  {
    const body = request.body

    const nameExists = persons.some(person => person.content === body.content)

    if (!body.content) {
      return response.status(400).json({
        error: 'content missing'
      })
    }

    if (nameExists) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    }


    const person =
    {
      content: body.content,
      important: body.important || false,
      date: new Date(),
      id: generateId(),
    }

    persons = persons.concat(person)

    response.json(person)


  })

const unknownEndpoint = (request, response) =>
{
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

//? puerto
const PORT = 3001

app.listen(PORT, () =>
{
  console.log(`Server is running on port ${PORT}`);
})
