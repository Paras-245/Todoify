import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../types/task';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityColors: Record<string, { bg: string; color: string }> = {
  low: { bg: '#dcfce7', color: '#15803d' }, // primary-100, primary-700
  medium: { bg: '#bbf7d0', color: '#166534' }, // primary-200, primary-800
  high: { bg: '#86efac', color: '#14532d' }, // primary-300, primary-900
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    marginBottom: '16px',
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      sx={{ position: 'relative' }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton {...attributes} {...listeners} size="small" sx={{ cursor: 'grab', mr: 1 }}>
              <DragIndicatorIcon fontSize="small" />
            </IconButton>
            <Chip
              size="small"
              label={task.priority}
              sx={{
                backgroundColor: priorityColors[task.priority].bg,
                color: priorityColors[task.priority].color,
                fontWeight: 'medium',
              }}
            />
          </Box>
          <Box>
            <IconButton size="small" onClick={() => onEdit(task)} color="primary">
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete(task.id)} color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Typography variant="h6" component="h3" sx={{ fontSize: '1rem', fontWeight: 600, mb: 0.5 }}>
          {task.title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {task.description}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'text.secondary' }}>
          <Typography variant="caption">
            {format(new Date(task.createdAt), 'MMM d, yyyy')}
          </Typography>
          
          <Chip
            size="small"
            label={task.status.replace('-', ' ')}
            sx={{
              backgroundColor: task.status === 'completed' ? '#dcfce7' : '#f3f4f6',
              color: task.status === 'completed' ? '#15803d' : 'inherit',
              textTransform: 'capitalize',
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};