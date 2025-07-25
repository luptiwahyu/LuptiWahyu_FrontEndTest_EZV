'use client'

import { FC, useState } from 'react'
import type { Task } from '../models/Task'

const Main: FC = () => {
  const [newTask, setNewTask] = useState<string>('')
  const [taskList, setTaskList] = useState<Task[]>([])
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [selectedTask, setSelectedTask] = useState<Task>({})

  const onAddTask = (): void => {
    const title = newTask.trim()
    console.log('title: ', title)
    if (title !== '') {
      console.log('masukk')
      setTaskList([
        {
          id: Date.now(),
          title,
          completed: false,
        },
        ...taskList,
      ])
      setNewTask('')
    }
  }

  const onEditTask = (task: Task): void => {
    setIsEdit(true)
    setSelectedTask(task)
  }

  const onSaveTask = (task: Task): void => {
    setIsEdit(false)
    setSelectedTask(task)

    const index = taskList.findIndex((i) => i.id === task.id)
    taskList[index] = selectedTask
    setTaskList([...taskList])
  }

  const onChangeTaskTitle = (value: string, id: number): void => {
    const newTaskList = [...taskList]
    const index = newTaskList.findIndex((task) => task.id === id)
    newTaskList[index].title = value
    setTaskList([...newTaskList])
  }

  const onChangeTaskCompleted = (id: number): void => {
    const newTaskList = [...taskList]
    const index = newTaskList.findIndex((task) => task.id === id)
    newTaskList[index].completed = !newTaskList[index].completed
    setTaskList([...newTaskList])

    setTimeout(() => {
      setTaskList(newTaskList.toSorted((a, b) => a.completed - b.completed))
    }, 500)
  }

  const onRemoveTask = (id: number): void => {
    setTaskList(taskList.filter((task) => task.id !== id))
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">To Do List</h1>

      <div className="mb-4">
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

      <div>
        <ul>
          {
            taskList.map((task) => (
              <li className="mb-4" key={task.id}>
                <input
                  id={`task-check-${task.id}`}
                  type="checkbox"
                  className="mr-3"
                  checked={task.completed}
                  disabled={isEdit}
                  onChange={() => onChangeTaskCompleted(task.id)}
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
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  )
}

export default Main
