import { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import './App.css';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [state, setState] = useState({
    todo: "",
    todos: [],
    error: false,
    isEditing: null,
    showFinished: true,
    deleteConfirmation: { state: false, todo: null }
  });
  const inputRef = useRef(null);

  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) setState(prevState => ({ ...prevState, todos: JSON.parse(storedTodos) }));
  }, []);

  const saveToLocalStorage = (updatedTodos) => {
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const toggleShowFinished = () => {
    setState(prevState => ({ ...prevState, showFinished: !prevState.showFinished }));
  };

  const handleEdit = (todoItem) => {
    setState(prevState => ({
      ...prevState,
      isEditing: todoItem.id,
      todo: todoItem.todo
    }));
    inputRef.current.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  const handleDelete = () => {
    const updatedTodos = state.todos.filter(todoItem => todoItem.id !== state.deleteConfirmation.todo.id);
    setState(prevState => ({
      ...prevState,
      todos: updatedTodos,
      deleteConfirmation: { state: false, todo: null }
    }));
    saveToLocalStorage(updatedTodos);
  };

  const handleAdd = () => {
    if (!state.todo) {
      setState(prevState => ({ ...prevState, error: true }));
      return;
    }
    const updatedTodos = state.isEditing
      ? state.todos.map(todoItem => (todoItem.id === state.isEditing ? { ...todoItem, todo: state.todo } : todoItem))
      : [...state.todos, { id: uuidv4(), todo: state.todo, isCompleted: false }];

    setState(prevState => ({
      ...prevState,
      todos: updatedTodos,
      todo: "",
      error: false,
      isEditing: null
    }));
    saveToLocalStorage(updatedTodos);
  };

  const handleChange = (e) => {
    setState(prevState => ({ ...prevState, todo: e.target.value }));
  };

  const handleCheckboxChange = (e) => {
    const updatedTodos = state.todos.map(todoItem =>
      todoItem.id === e.target.name ? { ...todoItem, isCompleted: !todoItem.isCompleted } : todoItem
    );
    setState(prevState => ({ ...prevState, todos: updatedTodos }));
    saveToLocalStorage(updatedTodos);
  };

  return (
    <>
      <Navbar />
      <div className="main-todo bg-slate-900 w-[60%] mx-auto mt-2 min-h-[90vh] py-3 px-4 rounded-lg flex flex-col gap-5">
        <div className="add flex flex-col gap-4">
          <h1 className="font-bold text-[23px]">Add a Todo</h1>
          <div className="input flex gap-5 justify-between">
            <input
              ref={inputRef}
              id="title-input"
              type="text"
              placeholder="Add here..."
              value={state.todo}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2 bg-slate-700 hover:scale-[1.01] duration-300 rounded-lg outline-none focus:bg-slate-950"
            />
            <button onClick={handleAdd} className="bg-slate-950 p-3 rounded-full hover:bg-gray-900 duration-200 hover:scale-110">
              <img src={state.isEditing ? "./edit2.svg" : "./add.svg"} alt="Add" />
            </button>
          </div>
          <div className="completed flex items-center gap-3 font-bold">
            <input
              type="checkbox"
              checked={state.showFinished}
              onChange={toggleShowFinished}
              className="w-5 h-5"
            />
            <span>Check your completed tasks here...</span>
          </div>
        </div>
        {state.error && <p className="text-red-800 font-bold">*Todo can't be empty</p>}
        <hr className="bg-black" />
        <div className="todo duration-200">
          <h1 className="font-bold text-[23px]">Your Todos</h1>
          {state.todos.length === 0 && (
            <div className="mt-2 px-3 flex items-center">
              <h1 className="text-[20px] font-bold text-gray-600">No todos to display...!</h1>
              <button onClick={() => inputRef.current.focus()} className="text-[20px] px-4 py-2 rounded-full hover:font-bold hover:underline duration-200 hover:scale-110">Add one</button>
            </div>
          )}
          {state.todos.map(todoItem => (
            (state.showFinished || !todoItem.isCompleted) && (
              <div key={todoItem.id} className="input-todo flex justify-between items-center px-3 py-2 hover:bg-slate-800 rounded-lg cursor-pointer mt-2 mx-auto duration-200 hover:scale-[1.01] gap-2">
                <input
                  type="checkbox"
                  name={todoItem.id}
                  checked={todoItem.isCompleted}
                  onChange={handleCheckboxChange}
                  className="w-5 h-5"
                />
                <div className="title text-[18px] flex gap-2 items-center w-[80%]">
                  <h1 className={todoItem.isCompleted ? "line-through text-gray-500" : ""}>{todoItem.todo}</h1>
                </div>
                <div className="btn-todo flex items-center gap-2">
                  <button onClick={() => handleEdit(todoItem)} className="bg-slate-950 p-2 rounded-full hover:bg-gray-900 duration-200 hover:scale-110">
                    <img src="./edit.svg" alt="Edit" />
                  </button>
                  <button onClick={() => setState(prevState => ({ ...prevState, deleteConfirmation: { state: true, todo: todoItem } }))} className="bg-slate-950 p-2 rounded-full hover:bg-gray-900 duration-200 hover:scale-110">
                    <img src="./delete.svg" alt="Delete" />
                  </button>
                </div>
              </div>
            )
          ))}
          {state.deleteConfirmation.state && (
            <div className="confirm-delete flex-col fixed top-0 left-0 backdrop-blur-sm justify-center items-center w-full h-full">
              <div className="delete bg-slate-950 p-5 rounded-xl flex flex-col gap-5">
                <h1 className="font-bold">Do you want to delete this task...</h1>
                <div className="buttons-delete flex gap-3 justify-end w-full">
                  <button onClick={() => setState(prevState => ({ ...prevState, deleteConfirmation: { state: false, todo: null } }))} className="px-3 py-2 border-red-50 border-[1px] rounded-3xl">Cancel</button>
                  <button onClick={handleDelete} className="px-3 py-2 bg-red-700 rounded-3xl">Delete</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
