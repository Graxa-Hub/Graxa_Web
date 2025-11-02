import React from 'react'

export function ButtonPage(props) {
  return (
    <button 
      onClick={props.click}
      className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 w-fill h-12"
     >
      {props.text}
    </button>
  )
}
