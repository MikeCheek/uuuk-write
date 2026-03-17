import React from 'react'

const InputText = (
  {
    id,
    value,
    label,
    onChange
  }
    : {
      id: string,
      value: string,
      label: string,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    }
) => {
  return (
    <>
      <label htmlFor={id} className="block text-gray-300 mb-1 font-medium">{label}</label>
      <input
        type="text"
        id={id}
        value={value}
        onChange={onChange}
        maxLength={30}
        placeholder="ex. Write the future"
        className="w-full p-2 text-black border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
      />
    </>
  )
}

export default InputText