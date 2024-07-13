import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import DeleteModal from './components/DeleteModal';

function App() {
  const [todo, setTodo] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [showFinished, setShowFinished] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ state: false, todo: null });
  const [add, setAdd] = useState(false);
  const [moreButtonTodo, setMoreButtonTodo] = useState(null); // State to track the "more" button

  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) setTodos(JSON.parse(storedTodos));
  }, []);

  const saveToLocalStorage = (updatedTodos) => {
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const toggleShowFinished = () => {
    setShowFinished(!showFinished);
  };

  const handleEdit = (todoItem) => {
    setIsEditing(todoItem.id);
    setTodo(todoItem.todo);
    setDescription(todoItem.description);
    setAdd(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  const handleDelete = () => {
    const updatedTodos = todos.filter(todoItem => todoItem.id !== deleteConfirmation.todo.id);
    setTodos(updatedTodos);
    saveToLocalStorage(updatedTodos);
    setDeleteConfirmation({ state: false, todo: null });
  };

  const handleAdd = () => {
    if (!todo) {
      setError(true);
      return;
    }
    const updatedTodos = isEditing
      ? todos.map(todoItem => (todoItem.id === isEditing ? { ...todoItem, todo, description } : todoItem))
      : [...todos, { id: uuidv4(), todo, description, isCompleted: false }];

    setTodos(updatedTodos);
    setTodo("");
    setDescription("");
    setError(false);
    setIsEditing(null);
    setAdd(false);
    saveToLocalStorage(updatedTodos);
  };

  const handleCancel = () => {
    setAdd(false);
    setTodo("");
    setDescription("");
  };

  const focusInput = () => {
    document.getElementById('title-input').focus();
  };

  const handleTodoChange = (e) => {
    setTodo(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleCheckboxChange = (e) => {
    const updatedTodos = todos.map(todoItem =>
      todoItem.id === e.target.name ? { ...todoItem, isCompleted: !todoItem.isCompleted } : todoItem
    );
    setTodos(updatedTodos);
    saveToLocalStorage(updatedTodos);
  };

  return (
    <>
      <Navbar />
      <div className="main-todo bg-[#F5F5F5] border-[2px] border-black dark:bg-slate-800 min-[1000px]:w-[60%] w-[90%] mx-auto mt-2 min-h-[89vh] py-3 px-4 rounded-lg flex flex-col gap-5 mb-6">
        <div className="add flex flex-col gap-4">
          <div className="heading flex justify-between">
            <h1 className="font-bold text-[23px] text-black dark:text-white">Add a Todo </h1>
            <button onClick={() => setAdd(true)} className={`bg-[#82CFFD] hover:bg-[#62B6E5] dark:bg-cyan-700 p-3 rounded-full hover:opacity-80 duration-200 hover:scale-110 max-sm:w-10 max-sm:h-10`}>
              <img className='invert dark:invert-0' src="./add.svg" alt="Add" />
            </button>
          </div>
          <div className={`input flex ${add ? "flex" : "hidden"} absolute min-h-[95%] w-full backdrop-blur top-0 left-0 justify-center h-full z-10`}>
            <div className="inputdisplay w-full mx-6 min-[600px]:w-[70%] my-auto min-h-[90%] flex flex-col gap-3 duration-300">
              <h1 className='text-[22px] font-bold text-black dark:text-white'>Title:</h1>
              <input
                id="title-input"
                type="text"
                placeholder="Add your task..."
                value={todo}
                onChange={handleTodoChange}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-2 bg-gray-200 dark:bg-slate-700 duration-300 rounded-lg outline-none focus:bg-gray-300 dark:focus:bg-slate-950 border-[2px] border-black dark:focus:border-white text-black dark:text-white placeholder:text-black dark:placeholder:text-white"
              />
              {error && <p className="text-red-800 font-bold">*Todo can't be empty</p>}
              <h1 className='text-[22px] font-bold text-black dark:text-white'>Description:</h1>
              <textarea
                className='w-full px-3 py-2 bg-gray-200 dark:bg-slate-700 duration-300 rounded-lg outline-none dark:focus:bg-slate-950 border-[2px] border-black dark:focus:border-white focus:bg-gray-300 text-black dark:text-white placeholder:text-black dark:placeholder:text-white'
                placeholder='Describe your task here...'
                rows={10}
                value={description}
                onChange={handleDescriptionChange}
              ></textarea>
              <div className="btn-add w-full flex justify-end gap-5">
                <button onClick={handleCancel} className="px-3 py-2 dark:border-red-50 dark:border-[2px] rounded-3xl hover:scale-105 hover:opacity-80 duration-200 text-black dark:text-white font-bold border-[2px] border-black">Cancel</button>
                <button onClick={handleAdd} className="px-5 py-2 bg-[#82CFFD] dark:bg-cyan-700 rounded-3xl hover:scale-105 hover:opacity-80 duration-200 text-black dark:text-white font-bold border-[2px] border-black">Save</button>
              </div>
            </div>
          </div>
          <div className="completed flex items-center gap-3 font-bold">
            <input
              type="checkbox"
              checked={showFinished}
              onChange={toggleShowFinished}
              className="w-5 h-5"
            />
            <span className='text-black dark:text-white font-bold text-[20px] max-sm:text-[16px]'>Check your completed tasks here...</span>
          </div>
        </div>
        <hr className="border-black dark:border-white border-[2px]" />
        <div className="todo duration-200">
          <h1 className="font-bold text-[23px] text-black dark:text-white">Your Todos</h1>
          {todos.length === 0 && (
            <div className="mt-2 px-3 flex items-center">
              <h1 className="text-[20px] font-bold text-gray-600">No todos to display...!</h1>
              <button onClick={focusInput} className="text-[20px] px-4 py-2 rounded-full hover:font-bold hover:underline duration-200 hover:scale-110 text-black dark:text-white">Add one</button>
            </div>
          )}
          {todos.map(todoItem => (
            (showFinished || !todoItem.isCompleted) && (
              <div key={todoItem.id} className="input-todo flex justify-between px-3 py-2 hover:bg-[#E3F2FD] dark:hover:bg-slate-700 rounded-lg cursor-pointer mt-2 mx-auto duration-200 hover:scale-[1.01] gap-5">
                <div className="left-input flex gap-3 items-center">
                  <input
                    type="checkbox"
                    name={todoItem.id}
                    checked={todoItem.isCompleted}
                    onChange={handleCheckboxChange}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <div onClick={() => { handleEdit(todoItem); focusInput(); }} className="title text-[18px] max-sm:text-[15px]">
                    <h1 className={todoItem.isCompleted ? "line-through text-gray-500 font-bold text-wrap" : "text-black dark:text-white font-bold text-wrap"}>{todoItem.todo}</h1>
                  </div>
                </div>
                <div className="btn-todo flex items-center gap-2">
                  <div className="flex gap-2">
                  <button onClick={() => { handleEdit(todoItem); focusInput(); }} className="bg-[#7B7B7B] hover:bg-[#82CFFD] dark:bg-slate-950 p-2 rounded-full dark:hover:bg-cyan-700 duration-200 hover:scale-110 hidden min-[500px]:flex">
                    <img className='invert dark:invert-0' src="./edit.svg" alt="Edit" />
                  </button>
                  <button onClick={() => setDeleteConfirmation({ state: true, todo: todoItem })} className="bg-[#7B7B7B] dark:bg-slate-950 p-2 rounded-full hover:bg-red-800 dark:hover:bg-red-800 duration-200 hover:scale-110 hidden min-[500px]:flex">
                    <img className='invert dark:invert-0' src="./delete.svg" alt="Delete" />
                  </button>
                  <button
                    onClick={() => setMoreButtonTodo(moreButtonTodo === todoItem.id ? null : todoItem.id)}
                    className="bg-[#7B7B7B] hover:opacity-80 dark:bg-slate-950 p-2 flex min-[500px]:hidden rounded-full dark:hover:bg-gray-900 duration-200 hover:scale-110 max-sm:w-8 max-sm:h-8">
                    <img className='w-5 invert dark:invert-0' src="./more.svg" alt="More" />
                  </button>
                </div>
                {moreButtonTodo === todoItem.id && (
                  <div className="btn-todo flex items-center gap-2 flex-col duration-200">
                    <button onClick={() => { handleEdit(todoItem); focusInput(); }} className="bg-[#7B7B7B] hover:bg-[#82CFFD] dark:bg-slate-950 p-2 rounded-full dark:hover:bg-cyan-700 duration-200 hover:scale-110">
                      <img className='invert dark:invert-0' src="./edit.svg" alt="Edit" />
                    </button>
                    <button onClick={() => setDeleteConfirmation({ state: true, todo: todoItem })} className="bg-[#7B7B7B] dark:bg-slate-950 p-2 rounded-full hover:bg-red-800 dark:hover:bg-red-800 duration-200 hover:scale-110">
                      <img className='invert dark:invert-0' src="./delete.svg" alt="Delete" />
                    </button>
                  </div>
                )}
                </div>
              </div>
            )
          ))}
          {deleteConfirmation.state && (
            <DeleteModal setDeleteConfirmation={setDeleteConfirmation} handleDelete={handleDelete} />
          )}
        </div>
      </div>
    </>
  );
}

export default App;
