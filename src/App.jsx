import { useContext, useState, createContext } from 'react'
import { Link, Routes, Route, useMatch, useNavigate } from 'react-router-dom'
import { useField } from '../hooks'

const NotificationContext = createContext()

const Menu = () => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <a href='#' style={padding}>anecdotes</a>
      <a href='#' style={padding}>create new</a>
      <a href='#' style={padding}>about</a>
    </div>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote =>
        <li key={anecdote.id} >
          <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
        </li>
      )}
    </ul>
  </div>
)

const Anecdote = ({ anecdote }) => {
  if (!anecdote) {
    return null
  }

  return (
    <div>
      <h4>{anecdote.content} by {anecdote.author}</h4>
      <p>
        has {anecdote.votes} votes
      </p>
      <p>
        <a href={anecdote.info}>{anecdote.info}</a>
      </p>
    </div>
  )
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)


const CreateNew = (props) => {
  const contentObj = useField('content')
  const authorObj = useField('author')
  const infoObj = useField('info')
  const navigate = useNavigate()
  const context = useContext(NotificationContext)

  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content: contentObj.value,
      author: authorObj.value,
      info: infoObj.value,
      votes: 0
    })
    navigate('/')
    context[1](`a new anecdote ${contentObj.value} created!`)
    setTimeout(() => context[1](''), 5000)
  }



  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...contentObj} />
        </div>
        <div>
          author
          <input {...authorObj} />
        </div>
        <div>
          url for more info
          <input {...infoObj} />
        </div>
        <button>create</button>
      </form>
    </div>
  )

}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))

  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  const padding = {
    padding: 5
  }



  const match = useMatch('/anecdotes/:id')
  const anecdote = match
    ? anecdotes.find(x => x.id === Number(match.params.id))
    : null

  return (
    <div>
      <NotificationContext.Provider value={[notification, setNotification]}>
        <div>
          <Link style={padding} to='/'>anecdotes</Link>
          <Link style={padding} to='/create'>new anecdote</Link>
          <Link style={padding} to='/about'>about</Link>
        </div>
        {notification}
        <Routes>
          <Route path='/' element={<AnecdoteList anecdotes={anecdotes} />} />
          <Route path='/create' element={<CreateNew addNew={addNew} />} />
          <Route path='/about' element={<About />} />
          <Route path='/anecdotes/:id' element={<Anecdote anecdote={anecdote} />} />
        </Routes>
        <div>
          <Footer />
        </div>
      </NotificationContext.Provider >
    </div>
  )
}

export default App
