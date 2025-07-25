import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const todoApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com/' }),
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: () => ({
        url: 'todos',
        method: 'GET',
        params: {
          _start: 0,
          _limit: 10,
        },
      }),
    }),
    addTodo: builder.mutation({
      query: (newTask) => ({
        url: 'todos',
        method: 'POST',
        body: newTask,
      }),
    }),
    deleteTodo: builder.mutation({
      query: (id) => ({
        url: `todos/${id}`,
        method: 'DELETE',
      }),
    }),
  })
})

export const { useGetTodosQuery, useAddTodoMutation, useDeleteTodoMutation } = todoApi
