import { configureStore } from '@reduxjs/toolkit'
import { todoApi } from './api'

export const todoStore = configureStore({
  reducer: {
    [todoApi.reducerPath]: todoApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(todoApi.middleware),
})
