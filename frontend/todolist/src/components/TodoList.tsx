import { useState, useEffect } from "react";
import axios from "axios";
import style from "./todo.module.css";

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

const TodoList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/tasks").then((response) => {
      setTasks(response.data);
    });
  }, []);

  const addTask = () => {
    if (!newTask) return;
    axios
      .post("http://localhost:5000/tasks", { title: newTask })
      .then((response) => {
        setTasks([...tasks, response.data]);
        setNewTask("");
      });
  };

  const toggleTask = (id: number) => {
    axios.put(`http://localhost:5000/tasks/${id}`).then((response) => {
      setTasks(tasks.map((task) => (task.id === id ? response.data : task)));
    });
  };

  const deleteTask = (id: number) => {
    axios.delete(`http://localhost:5000/tasks/${id}`).then(() => {
      setTasks(tasks.filter((task) => task.id !== id));
    });
  };

  return (
    <div className={style["container-todo"]}>
      <div className={style.todo}>
        <h1>To-Do List</h1>
        <div className={style["todo-add"]}>
          <input value={newTask} onChange={(e) => setNewTask(e.target.value)} />
          <button onClick={addTask}>Adicionar</button>
        </div>
        <ul className={style.lista}>
          {tasks.map((task) => (
            <li key={task.id}>
              <div className={style['tarefa-name']}>
                <span
                  style={{
                    textDecoration: task.completed ? "line-through" : "none",
                  }}
                >
                  {task.title}
                </span>
              </div>
              <div>
                <button onClick={() => toggleTask(task.id)}><i className="bi bi-check-lg"></i></button>
                <button onClick={() => deleteTask(task.id)}><i className="bi bi-trash"></i></button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;
