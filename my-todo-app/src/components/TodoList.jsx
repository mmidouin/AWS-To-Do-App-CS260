import React, {useState, useEffect} from "react";
// import "./styles.css"; // Assuming your CSS is in this file

function ToDoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskText, setEditedTaskText] = useState("");

  const API_URL =
    "https://na3wfpk6gi.execute-api.us-east-1.amazonaws.com/tasks";

  // Fetch all tasks from the backend
  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

   // Fetch a single task by ID - using the URL parameter approach
   const fetchTaskById = async (taskId) => {
    try {
      // Use query parameter instead of path parameter
      const response = await fetch(`${API_URL}/?taskId=${taskId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Check if the response is a single object or an array with one item
      const taskData = Array.isArray(data) && data.length === 1 ? data[0] : data;
      
      // Update only the specific task in the state
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.taskId === taskId ? taskData : task
        )
      );
      
      return taskData;
    } catch (error) {
      console.error(`Error fetching task ${taskId}:`, error);
      return null;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle new task input change
  const handleInputChange = (event) => {
    setNewTask(event.target.value);
  };

  // Add a new task via POST request
  const addTask = async () => {
    if (newTask.trim() !== "") {
      const taskData = {
        taskId: new Date().toISOString(), // Generate a unique taskId
        task: newTask,
        completed: false,
      };

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result.message);

        // Add the new task to the state instead of re-fetching all tasks
        setTasks((prevTasks) => [...prevTasks, taskData]);
      } catch (error) {
        console.error("Error adding task:", error);
      } finally {
        setNewTask("");
      }
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = async (currTaskId, completed) => {
    try {
      // Find the task object that matches the taskId
      const taskToUpdate = tasks.find((task) => task.taskId === currTaskId);
      if (!taskToUpdate) {
        console.error("Task not found!");
        return;
      }

      // Create updated task object
      const updatedTask = {
        ...taskToUpdate,
        completed: !completed,
      };

      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) throw new Error("Failed to update task");

      // Get the updated task from the server to ensure data consistency
      await fetchTaskById(currTaskId);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete a task via DELETE request
  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({taskId}),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Remove the deleted task from the state
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.taskId !== taskId)
      );
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Start editing a task
  const startEditing = (task) => {
    setEditingTaskId(task.taskId);
    setEditedTaskText(task.task);
  };

  const saveEditedTask = async (currTaskId) => {
    try {
      // Find the task object that matches the current editing task
      const taskToUpdate = tasks.find((task) => task.taskId === currTaskId);
      if (!taskToUpdate) {
        console.error("Task not found!");
        return;
      }

      // Update the task's text while preserving other properties
      const updatedTask = {...taskToUpdate, task: editedTaskText};

      // Make the API request to update the task
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) throw new Error("Failed to edit task");

      // Get the updated task from the server using fetchTaskById
      await fetchTaskById(currTaskId);

      setEditingTaskId(null);
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (editingTaskId) {
        saveEditedTask(editingTaskId);
      } else {
        addTask();
      }
    }
  };

  return (
    <div className="to-do-list">
      <div className="add-task-container">
        <input
          type="text"
          value={newTask}
          onChange={handleInputChange}
          placeholder="Add a new task"
          onKeyDown={handleKeyPress}
          className="task-input"
        />
        <button
          className="add-button"
          onClick={addTask}
        >
          Add
        </button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li
              key={task.taskId}
              className="todo-item"
            >
              <div className="task-left-section">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() =>
                    toggleTaskCompletion(task.taskId, task.completed)
                  }
                  className="task-checkbox"
                />

                {editingTaskId === task.taskId ? (
                  <input
                    type="text"
                    value={editedTaskText}
                    onChange={(e) => setEditedTaskText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="edit-task-input"
                  />
                ) : (
                  <span
                    className={`task-text ${task.completed ? "completed" : ""}`}
                  >
                    {task.task}
                  </span>
                )}
              </div>

              <div className="task-right-section">
                {editingTaskId === task.taskId ? (
                  <button
                    className="save-button"
                    onClick={() => saveEditedTask(task.taskId)}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="edit-button"
                    onClick={() => startEditing(task)}
                  >
                    Edit
                  </button>
                )}

                <button
                  className="delete-button"
                  onClick={() => deleteTask(task.taskId)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ToDoList;
