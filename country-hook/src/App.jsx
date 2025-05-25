import React, { useState, useEffect } from 'react'
import axios from 'axios'

const baseURL = `https://studies.cs.helsinki.fi/restcountries`

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  const getCountry = async (name) => {
    try {
      if (name) {
        const result = await axios.get(`${baseURL}/api/name/${name}`)
        setCountry({found: true, ...result})
      } else {
        setCountry(null)
      }
    } catch (error) {
      console.error(error)
      setCountry({found: false})
    }
  }

  useEffect(() => {getCountry(name)}, [name])

  return country
}

const Country = ({ country }) => {
  if (!country) {
    return null
  }

  if (!country.found) {
    return (
      <div>
        not found...
      </div>
    )
  }

  return (
    <div>
      <h3>{country.data.name.common} </h3>
      <div>capital {country.data.capital[0]} </div>
      <div>population {country.data.population}</div> 
      <img src={country.data.flags.svg} height='100' alt={`flag of ${country.data.name.common}`}/>  
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App