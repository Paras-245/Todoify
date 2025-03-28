import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { Task } from '../types/task';
import {
  addTask,
  updateTask,
  deleteTask,
  reorderTasks,
  setFilter,
} from '../store/taskSlice';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AddIcon from '@mui/icons-material/Add';
import {
  Container,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DialogActions,
  AppBar,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';

export const TaskList: React.FC = () => {
  const dispatch = useDispatch();
  const { tasks, filter } = useSelector((state: RootState) => state.tasks);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);
      dispatch(reorderTasks(arrayMove(tasks, oldIndex, newIndex)));
    }
  };

  const handleAddTask = (
    taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch(addTask(newTask));
  };

  const handleUpdateTask = (
    taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (editingTask) {
      const updatedTask: Task = {
        ...editingTask,
        ...taskData,
        updatedAt: new Date().toISOString(),
      };
      dispatch(updateTask(updatedTask));
    }
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter.status === 'all') return true;
      return task.status === filter.status;
    })
    .filter((task) => {
      if (filter.priority === 'all') return true;
      return task.priority === filter.priority;
    })
    .sort((a, b) => {
      if (filter.sortBy === 'date') {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return (
        priorityOrder[b.priority as keyof typeof priorityOrder] -
        priorityOrder[a.priority as keyof typeof priorityOrder]
      );
    });

  return (
    <>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Task Manager
          </Typography>
          <Button 
            color="inherit" 
            onClick={() => setIsFilterOpen(true)}
            startIcon={<FilterAltIcon />}
          >
            {!isMobile && "Filter"}
          </Button>
          <Button 
            color="inherit" 
            onClick={() => setIsFormOpen(true)}
            startIcon={<AddIcon />}
          >
            {!isMobile && "Add Task"}
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Dialog
          open={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterAltIcon color="primary" />
            Filter Tasks
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filter.status}
                  onChange={(e) =>
                    dispatch(setFilter({ status: e.target.value }))
                  }
                  label="Status"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="todo">To Do</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={filter.priority}
                  onChange={(e) =>
                    dispatch(setFilter({ priority: e.target.value }))
                  }
                  label="Priority"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={filter.sortBy}
                  onChange={(e) =>
                    dispatch(
                      setFilter({ sortBy: e.target.value as 'date' | 'priority' })
                    )
                  }
                  label="Sort By"
                >
                  <MenuItem value="date">Date</MenuItem>
                  <MenuItem value="priority">Priority</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsFilterOpen(false)} variant="contained">
              Apply
            </Button>
          </DialogActions>
        </Dialog>

        {(isFormOpen || editingTask) && (
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? handleUpdateTask : handleAddTask}
            onClose={() => {
              setIsFormOpen(false);
              setEditingTask(undefined);
            }}
          />
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredTasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            <Box sx={{ mt: 2 }}>
              {filteredTasks.length === 0 ? (
                <Box sx={{ textAlign: 'center', mt: 8, mb: 8 }}>
                  <Typography variant="h6" color="text.secondary">
                    No tasks found. Add your first task!
                  </Typography>
                </Box>
              ) : (
                filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={(task) => setEditingTask(task)}
                    onDelete={(id) => dispatch(deleteTask(id))}
                  />
                ))
              )}
            </Box>
          </SortableContext>
        </DndContext>
      </Container>
    </>
  );
};