import React from 'react'

export const TurneError = ({error}) => {
  return (
    <div className="mx-6 mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {error}
    </div>
  )
}
