import React from 'react'

export const Spinner: React.FC<{text: string, size?: string}> = ({ text = '', size = '5em' }) => {
  const header = text ? <h2 style={{ margin: 5 }}>{text}</h2> : null
  return (
    <div className="spinner">
      {header}
      <div className="loader" style={{ height: size, width: size }} />
    </div>
  )
};
