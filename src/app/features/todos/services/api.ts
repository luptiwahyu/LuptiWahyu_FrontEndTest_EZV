import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Task } from '../models/Task'

export const todoApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://jsonplaceholder.typicode.com/',
  }),
  endpoints: (builder) => ({
    getTodos: builder.query<Task[], void>({
      query: () => ({
        url: 'todos',
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
      async onQueryStarted(newTask, { dispatch, queryFulfilled }) {
        const postResult = dispatch(
          todoApi.util.updateQueryData('getTodos', undefined, (draft) => {
            draft.unshift(newTask)
          }),
        )

        try {
          await queryFulfilled
        } catch {
          postResult.undo()
        }
      },
    }),
    updateTodo: builder.mutation({
      query: ({ id, title, completed }) => ({
        url: `todos/${id}`,
        method: 'PUT',
        body: {
          title,
          completed,
        },
      }),
    }),
    deleteTodo: builder.mutation({
      query: (id) => ({
        url: `todos/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const deleteResult = dispatch(
          todoApi.util.updateQueryData('getTodos', undefined, (draft) => {
            const index = draft.findIndex((task) => task.id === id)
            if (index >= 0) draft.splice(index, 1)
          }),
        )

        try {
          await queryFulfilled
        } catch {
          deleteResult.undo()
        }
      },
    }),
  })
})

export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todoApi
