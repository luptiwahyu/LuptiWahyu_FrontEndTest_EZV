'use client'

import { FC, useState } from 'react'
import type { Task } from '../models/Task'

const Main: FC = () => {
  const [newTask, setNewTask] = useState<string>('')
  const [taskList, setTaskList] = useState<Task[]>([])
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [selectedTask, setSelectedTask] = useState<Task>({})

  const onAddTask = (): void => {
    if (newTask.trim() != '') {
      setTaskList([
        {
          id: Date.now(),
          name: newTask,
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
  }

  const onChangeTask = (value: string, id: number): void => {
    const newTaskList = [...taskList]
    const index = newTaskList.findIndex((task) => task.id === id)
    newTaskList[index].name = value
    setTaskList([...newTaskList])
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
          onInput={(e) => setNewTask(e.target.value)}
        />
        <button className="td-button" disabled={!newTask} onClick={onAddTask}>
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
                />

                { isEdit ? (
                  <input
                    type="text"
                    className="td-input mr-3"
                    value={task.name}
                    onChange={(e) => onChangeTask(e.target.value, task.id)}
                  />
                ) : (
                  <label
                    htmlFor={`task-check-${task.id}`}
                    className="mr-3"
                  >
                    {task.name}
                  </label>
                )}


                { isEdit ? (
                  <button
                    className="td-button mr-3"
                    onClick={() => onSaveTask()}
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
