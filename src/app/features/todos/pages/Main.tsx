'use client'

import { FC, useState } from 'react'
import type { Task } from '../models/Task'

const Main: FC = () => {
  const [newTask, setNewTask] = useState<string>('')
  const [taskList, setTaskList] = useState<Task[]>([])

  const addTask = (): void => {
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

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">To Do List</h1>

      <div className="mb-4">
        <input
          type="text"
          className="td-input mr-2"
          value={newTask}
          onInput={(e) => setNewTask(e.target.value)}
        />
        <button className="td-button" disabled={!newTask} onClick={addTask}>
          Add
        </button>
      </div>

      <div>
        <ul>
          {
            taskList.map((task) => (
              <li className="mb-4" key={task.id}>
                <span className="mr-3">{task.name}</span>
                <button className="td-button disabled">Remove</button>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  )
}

export default Main
