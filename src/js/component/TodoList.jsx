import React, { useState } from "react";

const TodoList = () => {

    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && inputValue.trim() !== '') {
        setTasks([...tasks, inputValue]);
        setInputValue('');
        }
    };

    const handleDelete = (index) => {
        const newTasks = tasks.filter((task, i) => i !== index);
        setTasks(newTasks);
    };

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
                        tasks.map((task, index) => (
                        <li key={index} className="task">
                            {task}
                            <span className="delete-icon" onClick={() => handleDelete(index)}>X</span>
                        </li>
                    ))
                    )}
                </ul>
            </div>
        </div>
      );

};

export default TodoList;