import React from 'react'

const DeleteModal = ({setDeleteConfirmation, handleDelete}) => {
    return (
        <div className="confirm-delete flex-col fixed top-0 left-0 flex backdrop-blur-sm justify-center items-center w-full h-full duration-300">
            <div className="delete bg-gray-400 dark:bg-slate-950 p-5 rounded-xl flex flex-col gap-5 duration-300 border-[2px] border-black">
                <h1 className="font-bold text-black dark:text-white">Do you want to delete this task...</h1>
                <div className="buttons-delete flex gap-3 justify-end w-full">
                    <button onClick={() => setDeleteConfirmation({ state: false, todo: null })} className="px-3 py-2 dark:border-red-50 border-[2px] rounded-3xl hover:scale-105 hover:opacity-80 duration-200 text-black dark:text-white font-bold border-black">Cancel</button>
                    <button onClick={handleDelete} className="px-3 py-2 bg-red-600 dark:bg-red-700 rounded-3xl hover:scale-105 hover:opacity-80 duration-200 text-black dark:text-white font-bold">Delete</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteModal
