import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskState } from '../types/task';

const loadTasks = (): Task[] => {
  const tasks = localStorage.getItem('tasks');
  return tasks ? JSON.parse(tasks) : [];
};

const initialState: TaskState = {
  tasks: loadTasks(),
  filter: {
    status: 'all',
    priority: 'all',
    sortBy: 'date',
  },
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex((task) => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    reorderTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    setFilter: (state, action: PayloadAction<Partial<TaskState['filter']>>) => {
      state.filter = { ...state.filter, ...action.payload };
    },
  },
});

export const { addTask, updateTask, deleteTask, reorderTasks, setFilter } =
  taskSlice.actions;
export default taskSlice.reducer;