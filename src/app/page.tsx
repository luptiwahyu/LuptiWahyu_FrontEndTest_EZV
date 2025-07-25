'use client'

import { FC } from 'react'
import { Provider } from 'react-redux'
import Todo from './features/todos/pages/Main'
import { todoStore } from './features/todos/services/store'

export default function Home(): FC {
  return (
    <Provider store={todoStore}>
      <Todo />
    </Provider>
  )
}
