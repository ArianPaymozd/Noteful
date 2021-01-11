import React from 'react'
import {Route, Link} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import NoteListNav from '../NoteListNav/NoteListNav'
import NotePageNav from '../NotePageNav/NotePageNav'
import NoteListMain from '../NoteListMain/NoteListMain'
import NotePageMain from '../NotePageMain/NotePageMain'
import AddFolder from '../AddFolder/AddFolder'
import AddNote from '../AddNote/AddNote'
import ApiContext from '../ApiContext'
import config from '../config'
import './App.css'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

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

    handleDeleteNote = noteId => {
        this.setState({
            notes: this.state.notes.filter(note => note.id !== noteId)
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
