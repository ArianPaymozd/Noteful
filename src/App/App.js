import React from 'react'
import {Route, Link} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import NoteListNav from '../NoteListNav/NoteListNav'
import NotePageNav from '../NotePageNav/NotePageNav'
import NoteListMain from '../NoteListMain/NoteListMain'
import NotePageMain from '../NotePageMain/NotePageMain'
import AddFolder from '../AddFolder/AddFolder'
import AddNote from '../AddNote/AddNote'
import EditNote from '../EditNote/EditNote'
import ApiContext from '../ApiContext'
import config from '../config'
import './App.css'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import EditFolder from '../EditFolder/EditFolder'

class App extends React.Component {
    state = {
        notes: [],
        folders: [],
    };

    componentDidMount() {
        Promise.all([
            fetch(`${config.API_ENDPOINT}/notes`),
            fetch(`${config.API_ENDPOINT}/folders`)
        ])
            .then(([notesRes, foldersRes]) => {
                if (!notesRes.ok)
                    return notesRes.json().then((e) => Promise.reject(e))
                if (!foldersRes.ok)
                    return foldersRes.json().then((e) => Promise.reject(e))

                return Promise.all([
                    notesRes.json(),
                    foldersRes.json(),
                ])
            })
            .then(([notes, folders]) => {
                this.setState({ notes, folders })
            })
            .catch(error => {
                console.error({error})
            })
    }

    handleAddFolder = folder => {
        this.setState({
            folders: [
                ...this.state.folders,
                folder
            ]
        })
    }

    handleAddNote = note => {
        this.setState({
            notes: [
                ...this.state.notes,
                note
            ]
        })
    }

    handleUpdateNote = updatedNote => {
        const newNotes = this.context.notes.map(note =>
          (note.note_id === updatedNote.note_id)
            ? updatedNote
            : note
        )
        this.setState({
          notes: newNotes
        })
    }

    handleDeleteNote = noteId => {
        const newNotes = this.state.notes.filter(note => note.note_id !== noteId)
        this.setState({
            notes: newNotes
        })
    }

    handleDeleteFolder = folderId => {
        const newFolders = this.state.folders.filter(folder => folder.folder_id !== folderId)
        this.setState({
            folders: newFolders
        })
    }

    handleEditNote = editedNote => {
        const editedNotes = this.state.notes.map(note => {
            return (note.note_id === editedNote.note_id) ? editedNote : note
        })
        
        this.setState({
            notes: editedNotes
        })
    }

    handleEditFolder = editedFolder => {
        const editedFolders = this.state.folders.map(folder => {
            return folder.folder_id === editedFolder.folder_id ? editedFolder : folder
        })
        this.setState({
            folders: editedFolders
        })
    }

    renderNavRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path =>
                    <ErrorBoundary key={path}>
                        <Route
                            exact
                            key={path}
                            path={path}
                            component={NoteListNav}
                        /> 
                    </ErrorBoundary>
                )}
                <ErrorBoundary>
                    <Route
                        path='/note/:noteId'
                        component={NotePageNav}
                    />
                </ErrorBoundary>
                
                <ErrorBoundary>
                    <Route
                        path='/add-folder'
                        component={NotePageNav}
                    />
                </ErrorBoundary>
                

                <ErrorBoundary>
                    <Route
                        path='/add-note'
                        component={NotePageNav}
                    />
                </ErrorBoundary>

                <ErrorBoundary>
                    <Route
                        path='/edit-note'
                        component={NotePageNav}
                    />
                </ErrorBoundary>

                <ErrorBoundary>
                    <Route
                        path='/edit-folder'
                        component={NotePageNav}
                    />
                </ErrorBoundary>
            </>
        )
    }

    renderMainRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path =>
                    <ErrorBoundary key={path}>
                       <Route
                            exact
                            key={path}
                            path={path}
                            component={NoteListMain}
                        /> 
                    </ErrorBoundary>
                )}
                <ErrorBoundary>
                    <Route
                        path='/note/:noteId'
                        component={NotePageMain}
                    />
                </ErrorBoundary>
                
                <ErrorBoundary>
                   <Route
                        path='/add-folder'
                        component={AddFolder}
                    /> 
                </ErrorBoundary>
                
                <ErrorBoundary>
                    <Route
                        path='/add-note'
                        component={AddNote}
                    />
                </ErrorBoundary>

                <ErrorBoundary>
                    <Route
                        path='/edit-note/:noteId'
                        component={EditNote}
                    />
                </ErrorBoundary>

                <ErrorBoundary>
                    <Route
                        path='/edit-folder/:folderId'
                        component={EditFolder}
                    />
                </ErrorBoundary>
            </>
        )
    }

    render() {
        const value = {
            folders: this.state.folders,
            notes: this.state.notes,
            addFolder: this.handleAddFolder,
            addNote: this.handleAddNote,
            deleteNote: this.handleDeleteNote,
            deleteFolder: this.handleDeleteFolder,
            editNote: this.handleEditNote,
            editFolder: this.handleEditFolder
        }
        return (
            <ApiContext.Provider value={value}>
                <div className='App'>
                    <nav className='App_nav'>
                        {this.renderNavRoutes()}
                    </nav>
                    <header className='App_header'>
                        <h1>
                            <Link to='/'>Noteful</Link>
                            {' '}
                            <FontAwesomeIcon icon='check-double' />
                        </h1>
                    </header>
                    <main className='App_main'>
                        {this.renderMainRoutes()}
                    </main>
                </div>
            </ApiContext.Provider>
        )
    }
}

export default App
