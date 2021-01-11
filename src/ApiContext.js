import React from 'react'

export default React.createContext({
    folders: [],
    notes: [],
    addFolder: () => {},
    addNote: () => {},
    deleteNote: () => {},
    error: false,
    setError: () => {}
})
