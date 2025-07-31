import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Task } from '../models/Task'

export const todoApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://jsonplaceholder.typicode.com/',
  }),
  endpoints: (builder) => ({
    getTodos: builder.query<Task[], void>({
      query: (start: number) => ({
        url: 'todos',
        params: {
          _start: start,
          _limit: 10,
        },
      }),
      transformResponse: (response) => {
        return response.toSorted((a, b) => a.completed - b.completed)
      },
    }),
    addTodo: builder.mutation({
      query: (task: Task) => ({
        url: 'todos',
        method: 'POST',
        body: task,
      }),
      async onQueryStarted(task, { dispatch, queryFulfilled }) {
        const postResult = dispatch(
          todoApi.util.updateQueryData('getTodos', task.start, (draft) => {
            draft.unshift(task)
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
      query: ({ id, title, completed, start }) => ({
        url: `todos/${id}`,
        method: 'PUT',
        body: {
          title,
          completed,
        },
      }),
      async onQueryStarted({ id, title, completed, start }, { dispatch, queryFulfilled }) {
        const updateResult = dispatch(
          todoApi.util.updateQueryData('getTodos', start, (draft) => {
            const index = draft.findIndex((task) => task.id === id)
            if (index >= 0) {
              draft[index].title = title
              draft[index].completed = completed
            }
          }),
        )

        try {
          await queryFulfilled
        } catch {
          updateResult.undo()
        }
      },
    }),
    deleteTodo: builder.mutation({
      query: ({ id, start }) => ({
        url: `todos/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted({ id, start }, { dispatch, queryFulfilled }) {
        const deleteResult = dispatch(
          todoApi.util.updateQueryData('getTodos', start, (draft) => {
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
