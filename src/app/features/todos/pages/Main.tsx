'use client'

import { FC, useState } from 'react'
import type { Task } from '../models/Task'
import {
  todoApi,
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} from '../services/api'
import { useDispatch } from 'react-redux'

const Main: FC = () => {
  const [newTask, setNewTask] = useState<string>('')
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [selectedTask, setSelectedTask] = useState<Task>({})
  const { data: taskList = [], error, isLoading } = useGetTodosQuery()
  const [addTodo] = useAddTodoMutation()
  const [updateTodo] = useUpdateTodoMutation()
  const [deleteTodo] = useDeleteTodoMutation()
  const isFetchSucceed = !isLoading && !error
  const isEmptyData = isFetchSucceed && !taskList.length
  const [errorMessage, setErrorMessage] = useState<string>('')
  const dispatch = useDispatch()

  const onAddTask = async (): void => {
    setErrorMessage('')
    const title = newTask.trim()
    if (title !== '') {
      try {
        await addTodo<Task>({
          id: Date.now(),
          title,
          completed: false,
        }).unwrap()

        setNewTask('')
      } catch {
        setErrorMessage('Failed to add task')
      }
    }
  }

  const onEditTask = (task: Task): void => {
    setIsEdit(true)
    setSelectedTask(task)
  }

  const onSaveTask = async (task: Task): void => {
    setIsEdit(false)
    setSelectedTask(task)
    setErrorMessage('')

    try {
      await updateTodo<Task>({
        id: task.id,
        title: task.title,
        completed: task.completed,
      }).unwrap()
    } catch {
      setErrorMessage('Failed to update task')
    }
  }

  const onChangeTaskTitle = (value: string, id: number): void => {
    const todos = dispatch(
      todoApi.util.updateQueryData('getTodos', undefined, (draft) => {
        const index = draft.findIndex((task) => task.id === id)
        draft[index].title = value
      }),
    )
  }

  const onChangeTaskCompleted = async (task: Task): void => {
    setErrorMessage('')

    try {
      await updateTodo<Task>({
        id: task.id,
        title: task.title,
        completed: !task.completed,
      }).unwrap()
    } catch {
      setErrorMessage('Failed to checked task')
    }
  }

  const onRemoveTask = async (id: number): void => {
    try {
      await deleteTodo<number>(id).unwrap()
    } catch {
      setErrorMessage('Failed to remove task')
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">To Do List</h1>

      <div className="">
        <input
          type="text"
          placeholder="Add new task"
          className="td-input mr-2"
          value={newTask}
          disabled={isEdit}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button
          className="td-button"
          disabled={!newTask.trim() || isEdit}
          onClick={onAddTask}
        >
          Add
        </button>
      </div>

      <div className="h-9 leading-9 text-sm">
        { isLoading && <span>Loading...</span> }

        { error && <span className="text-red-500">Error fetching data</span> }

        { !!errorMessage && <span className="text-red-500">{errorMessage}</span> }

        { isEmptyData && <span>Empty data</span> }
      </div>

      <div>
        {
          isFetchSucceed && taskList.map((task) => (
            <div className="mb-4" key={task.id}>
              <input
                id={`task-check-${task.id}`}
                type="checkbox"
                className="mr-3"
                checked={task.completed}
                disabled={isEdit}
                onChange={() => onChangeTaskCompleted(task)}
              />

              { isEdit && (selectedTask.id === task.id) ? (
                <input
                  type="text"
                  className="td-input mr-3"
                  value={task.title}
                  onChange={(e) => onChangeTaskTitle(e.target.value, task.id)}
                />
              ) : (
                <label
                  htmlFor={`task-check-${task.id}`}
                  className={`mr-3 ${task.completed ? 'line-through' : ''}`}
                >
                  {task.title}
                </label>
              )}


              { isEdit && (selectedTask.id === task.id) ? (
                <button
                  className="td-button mr-3"
                  disabled={!task.title.trim()}
                  onClick={() => onSaveTask(task)}
                >
                  Save
                </button>
              ) : (
                <button
                  className="td-button mr-3"
                  disabled={isEdit}
                  onClick={() => onEditTask(task)}
                >
                  Edit
                </button>
              )}

              <button
                className="td-button"
                disabled={isEdit}
                onClick={() => onRemoveTask(task.id)}
              >
                Remove
              </button>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Main
