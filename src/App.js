import React, { useEffect, useState } from 'react';
import './firebase-config';
import { getDatabase, ref, push, onValue, remove, update } from "firebase/database";
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import './App.css'

function App() {
  const [task, setTask] = useState(''); // Task input
  const [posts, setPosts] = useState([]); // State for storing tasks
  const [editingTaskId, setEditingTaskId] = useState(null); // State for tracking task being edited
  const [editingText, setEditingText] = useState(''); // State for the new text during editing
  const [showButton, setShowButton] = useState(false);
  const [CannotBeEmpty, setCannotBeEmpty] = useState('');
  const [mode, setMode] = useState(localStorage.getItem('mode') || 'light');

  useEffect(() => {
    localStorage.setItem('mode', mode);
    if (mode === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [mode]);

  const toggleMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    if (mode === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []);





  // Form submission handler to add or update a task
  const handleSubmit = (event) => {
    event.preventDefault();
    const db = getDatabase();





    if (editingTaskId) {
      // Validate that editingText is not empty
      if (!editingText.trim()) {
        alert("Task name cannot be empty.");
        return;
      }

      // Update the task if editing
      const updates = {};
      updates[`users/${editingTaskId}/Name`] = editingText;
      update(ref(db), updates)
        .then(() => {
          alert("Task Successfully Updated");
          setTask(''); // Clear the input field
          setEditingTaskId(null); // Reset editing state
          setEditingText(''); // Clear editing text
          setCannotBeEmpty('');
        })
        .catch((error) => {
          alert(error);
        });
    } else {
      // Validate that task is not empty
      if (!task.trim()) { // Corrected validation check
        setCannotBeEmpty("Task name cannot be empty."); // Set validation message
        return;
      }

      // Add new task
      push(ref(db, 'users/'), {
        Name: task,
        isDone: false, // New tasks are not done by default
      })
        .then(() => {
          alert("Task Successfully Submitted");
          setTask(''); // Clear the input field after submission
          setCannotBeEmpty(''); // Clear validation message after successful submission
        })
        .catch((error) => {
          alert(error);
        });
    }
  }


  // Real-time data listener using onValue
  useEffect(() => {
    const db = getDatabase();
    const tasksRef = ref(db, 'users/');

    const unsubscribe = onValue(tasksRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const taskList = Object.keys(data).map(key => ({
          id: key,
          name: data[key].Name,
          isDone: data[key].isDone, // Add isDone state for each task
        }));
        setPosts(taskList); // Update state with real-time data
      } else {
        console.log("No data available");
        setPosts([]); // Clear posts if no data is available
      }
    }, (error) => {
      console.error(error);
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []);

  // Handler function for the 'task' input field
  const handleTaskChange = (event) => {
    setTask(event.target.value);
  };

  // Function to delete a task with confirmation
  const handleDelete = (taskId) => {
    const db = getDatabase();

    // Show confirmation dialog before deletion
    const isConfirmed = window.confirm("Are you sure you want to delete this task?");

    if (isConfirmed) {
      // If user confirms, proceed with deletion
      remove(ref(db, `users/${taskId}`))
        .then(() => {
          alert("Task Deleted Successfully");
        })
        .catch((error) => {
          alert(error);
        });
    } else {
      // If user cancels, no action is taken
      alert("Task deletion canceled");
    }
  };

  // Function to initiate editing a task
  const handleEdit = (taskId, taskName) => {
    setShowButton(prevState => !prevState);
    setEditingTaskId(taskId);
    setEditingText(taskName);

  };

  //Edit Hide and block
  const EditHideAndBlcok = () => {
    setShowButton(prevState => !prevState);
    window.location.reload(true);
  }


  // Handler for editing input field
  const handleEditChange = (event) => {
    setEditingText(event.target.value);

  };

  // Function to mark a task as done or undone
  const handleMarkDone = (taskId, currentStatus) => {
    const db = getDatabase();
    update(ref(db, `users/${taskId}`), {
      isDone: !currentStatus, // Toggle isDone status
    })
      .then(() => {
        console.log("Task status updated");
      })
      .catch((error) => {
        alert(error);
      });
  };




  return (
    <div className={mode === 'dark' ? 'dark' : 'light'}>
      <div>
        <nav className='nav p-3 text-white bg-sky-400 font-bold text-2xl flex justify-between'>
          <h1>TodoList</h1>
          <span className='mode'>
            {mode === 'light' ? (
              <button onClick={toggleMode}><DarkModeIcon className='text-amber-500' /></button>
            ) : (
              <button onClick={toggleMode}><LightModeIcon className='text-amber-500' /></button>
            )}
          </span>
        </nav>
      </div>

      {/* Input form for submitting a task */}
      <div className='container-fluid col-lg-6 '>
        <div >
          <form onSubmit={handleSubmit}
            className='flex justify-center'
          >
            <div className='pt-5'>
              <input
                className='border-solid border-2 round mr-3  rounded-md p-2'
                type="text"
                value={task} // Shows the task to edit if in edit mode
                onChange={handleTaskChange}
                placeholder="Enter Task"
              />

              <button
                type="submit"
                className='bg-sky-500 p-2 rounded hover:bg-sky-600 text-white'
              ><strong><AddIcon /> Add</strong>
              </button>
              {CannotBeEmpty && <p className='text-red-500'>{CannotBeEmpty}</p>}


            </div>


            {/* edit form */}
            {showButton && (
              <div className=' w-full h-full order-form blurd absolute  ChangeBackGround'>
                <div className='flex items-center justify-center md:h-full '>
                  <div className='-mt-32 p-3 relative bg-gray-500 shadow-md  rounded'>
                    <div className=' mb-10'>
                      <div className=' Icon w-full'>
                        <h1 className='text-white text-2xl font-bold text-center'>Edit <EditIcon /></h1>
                        <div onClick={EditHideAndBlcok} className='flex justify-end text-white cursor-pointer  -mt-10'>
                          <CloseIcon />
                        </div>
                      </div>
                    </div>

                    <input
                      className='border-solid border-2 round mr-3 mb-5 rounded-md p-2'
                      type="text"
                      value={editingText} // Shows the task to edit if in edit mode
                      onChange={handleEditChange}
                      placeholder="Enter Task"
                    />
                    <button
                      type="submit"
                      className='bg-sky-500 p-2 rounded hover:bg-sky-600 text-white'
                    >
                      <EditIcon />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>

          <table className='table table-striped mt-5'>
            <thead>
              <tr>
                <th>Task</th>
                <th>Mark Done</th>
                <th>Delete</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td style={{ textDecoration: post.isDone ? 'line-through' : 'none' }} >
                    {post.name}
                    {post.isDone ? (
                      <i className="fa fa-question-circle hidden" aria-hidden="true"></i>
                    ) : (
                      <i className="fa fa-question-circle" aria-hidden="true" style={{ marginLeft: '8px' }}></i>
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleMarkDone(post.id, post.isDone)}>
                      {post.isDone ? (
                        <>
                          <p className='bg-orange-500 hover:bg-orange-600 text-white p-1 rounded '>Undo <i class="fa fa-undo" aria-hidden="true"></i></p>
                        </>
                      ) : (
                        <p className='bg-green-500 hover:bg-green-600 text-white p-1 rounded '> Mark done <i className="fa fa-check" aria-hidden="true"></i></p>
                      )}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(post.id)} className='bg-red-500 hover:bg-red-600 p-1 text-white rounded'>Delete <i class="fa fa-trash" aria-hidden="true"></i></button>
                  </td>
                  <td>
                    <button onClick={() => handleEdit(post.id, post.name)} className='bg-orange-500 hover:bg-orange-600 p-1 text-white rounded'> <EditIcon /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
