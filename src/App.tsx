import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { AuthPage } from './components/auth/AuthPage';
import { useAuth } from './contexts/AuthContext';
import { Calendar } from './components/Calendar';
import { TaskList } from './components/TaskList';
import { Heatmap } from './components/Heatmap';
import { TaskInput } from './components/TaskInput';
import { auth, db } from './lib/firebase';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { Task } from './types';
import { isSameDay } from 'date-fns';

function AppContent() {
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (!user) return;

    console.log('Setting up tasks listener for user:', user.uid);

    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData: Task[] = [];
      snapshot.forEach((doc) => {
        tasksData.push({ id: doc.id, ...doc.data() } as Task);
      });
      console.log('Fetched tasks:', tasksData);
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddTask = async (text: string) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      const newTask = {
        text: text,
        completed: false,
        date: selectedDate.toISOString(),
        createdAt: new Date().toISOString(),
        userId: user.uid
      };

      await addDoc(collection(db, 'tasks'), newTask);
      
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    if (!user) return;

    try {
      const taskRef = doc(db, 'tasks', taskId);
      const task = tasks.find(t => t.id === taskId);
      
      if (!task) {
        console.error('Task not found:', taskId);
        return;
      }

      await updateDoc(taskRef, {
        completed: !task.completed,
        updatedAt: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!user) return;

    try {
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);

    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <AuthPage />;
  }

  const filteredTasks = tasks.filter(task => 
    isSameDay(new Date(task.date), selectedDate)
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Task Manager
          </h1>
          <button
            onClick={() => auth.signOut()}
            className="px-4 py-2 text-sm text-red-600 hover:text-red-800"
          >
            Sign Out
          </button>
        </div>
        
        <div className="space-y-6">
          <Heatmap tasks={tasks} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              tasks={tasks}
            />

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <TaskInput
                  selectedDate={selectedDate}
                  onAddTask={handleAddTask}
                />
                
                <div className="mt-6">
                  <TaskList
                    tasks={filteredTasks}
                    onToggleTask={handleToggleTask}
                    onDeleteTask={handleDeleteTask}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;