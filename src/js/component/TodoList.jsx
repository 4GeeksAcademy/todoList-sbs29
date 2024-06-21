import React, { useState, useEffect } from "react";

const TodoList = () => {
    
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const userName = "sebas";

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && inputValue.trim() !== '') {
            const newTask = { label: inputValue, done: false };
            setTasks(prevTasks => [...prevTasks, newTask]);
            setInputValue('');
            updateTasksOnServer([newTask]);
        }
    };

    const handleDelete = (id) => {
        fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
            method: "DELETE"
        })
        .then(resp => {
            if (!resp.ok) throw new Error(resp.statusText);
            setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
        })
        .catch(error => console.error('Error deleting task:', error));
    };

    const deleteTasks = () => {
        tasks.forEach(task => {
            if (task.id) {
                fetch(`https://playground.4geeks.com/todo/todos/${task.id}`, {
                    method: "DELETE"
                })
                .then(resp => {
                    if (!resp.ok) throw new Error(resp.statusText);
                })
                .catch(error => console.error('Error deleting task:', error));
            }
        });
        setTasks([]);
    };

    const updateTasksOnServer = (newTasks) => {
        newTasks.forEach(task => {
            if (task.id) {
                fetch(`https://playground.4geeks.com/todo/todos/${task.id}`, {
                    method: "PUT",
                    body: JSON.stringify(task),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .then(resp => {
                    if (!resp.ok) throw new Error(resp.statusText);
                    return resp.json();
                })
                .then(data => console.log('Task updated:', data))
                .catch(error => console.error('Error updating task:', error));
            } else {
                fetch(`https://playground.4geeks.com/todo/todos/${userName}`, {
                    method: "POST",
                    body: JSON.stringify(task),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .then(resp => {
                    if (!resp.ok) throw new Error(resp.statusText);
                    return resp.json();
                })
                .then(data => {
                    console.log('Task created:', data);
                    setTasks(prevTasks => prevTasks.map(t => 
                        t.label === task.label ? {...t, id: data.id} : t
                    ));
                })
                .catch(error => console.error('Error creating task:', error));
            }
        });
    };

    useEffect(() => {
        fetch(`https://playground.4geeks.com/todo/users/${userName}`)
            .then(resp => {
                if (!resp.ok) throw new Error(resp.statusText);
                return resp.json();
            })
            .then(data => {
                if (data.todos) setTasks(data.todos);
            })
            .catch(error => {
                console.error('Error fetching tasks:', error);
                if (error.message === "Not Found") {
                    fetch(`https://playground.4geeks.com/todo/users/${userName}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ name: userName })
                    })
                    .then(resp => {
                        if (!resp.ok) throw new Error(resp.statusText);
                        return resp.json();
                    })
                    .then(data => console.log('User created:', data))
                    .catch(error => console.error('Error creating user:', error));
                }
            });
    }, [userName]);

    return (
        <div className="app">
            <h1>Todos</h1>
            <div className="notebook">
                <input
                    type="text"
                    placeholder="¿What needs to be done?"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <ul>
                    {tasks.length === 0 ? (
                        <li>No hay tareas, añadir tareas</li>
                    ) : (
                        tasks.map((task) => (
                            <li key={task.id} className="task">
                                {task.label}
                                <span className="delete-icon" onClick={() => handleDelete(task.id)}>X</span>
                            </li>
                        ))
                    )}
                </ul>
                <footer>{tasks.length} items left</footer>
            </div>
            <button onClick={deleteTasks}>Delete All Tasks</button>
        </div>
    );
};

export default TodoList;
