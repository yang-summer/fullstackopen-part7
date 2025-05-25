import { useState, useRef } from 'react'
import { Routes, Route, Link, useMatch } from 'react-router'
import Menu from './components/Menu'
import AnecdoteList from './components/AnecdoteList'
import CreateNew from './components/CreateNew'
import About from './components/About'
import Anecdote from './components/Anecdote'
import Footer from './components/Footer'

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
  const timerRef = useRef(null)

  const match = useMatch('/anecdotes/:id')
  const anecdote = match 
    ? anecdotes.find(anecdote => anecdote.id === Number(match.params.id))
    : null

  const notifyWith = (notification) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setNotification(notification)
    timerRef.current = setTimeout(() => setNotification(null), 5000)
  }

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
    notifyWith(`a new anecdote ${anecdote.content} created!`)
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

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu />
      <div>{notification}</div>
      <Routes>
        <Route path="/anecdotes/:id" element={<Anecdote anecdote={anecdote}/>}/>
        <Route path="/" element={<AnecdoteList anecdotes={anecdotes}/>}></Route>
        <Route path="/anecdotes" element={<AnecdoteList anecdotes={anecdotes}/>}></Route>
        <Route path="/create" element={<CreateNew addNew={addNew} />}></Route>
        <Route path="/about" element={<About />}></Route>
      </Routes>
      <Footer />
    </div>
  )
}

export default App
