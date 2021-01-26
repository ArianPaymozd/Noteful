import React from 'react'
import PropTypes from 'prop-types'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import config from '../config'
import './EditNote.css'

export default class EditNote extends React.Component {
    static defaultProps = {
        match: {
            params: {}
        },
        history: {push: () => {}}
    }

    state = {
        error: false,
        folder_id: '...'
    }

    static contextType = ApiContext;

    handleSubmit = (e) => {
        e.preventDefault()
        const newNote = {
            note_name: e.target['edit-name'].value,
            content: e.target['edit-content'].value,
            folder_id: (e.target['edit-folder-select'].value === '...') ? '...' : parseInt(e.target['edit-folder-select'].value)
        }
        this.setState({
            folder_id: e.target['edit-folder-select'].value
        })
        if (newNote.folder_id !== '...') {
            fetch(`${config.API_ENDPOINT}/notes/${this.state.note_id}`, {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(newNote),
            })
            .then(res => {
                if (!res.ok) {
                    this.setState({
                        errorMessage: `${res.status}: ${res.statusText}`
                    })
                    return res.json().then((e) => Promise.reject(e))
                }
                return res.json()
            })
            .then(note => {
                const date = new Date()
                note.note_id = parseInt(this.props.match.params.noteId)
                note.modified = date.toDateString()
                this.context.editNote(note)
                this.props.history.push(`/note/${note.note_id}`)
            })
            .catch(error => {
                this.setState({
                    error: {status: true}
                })
            })
            
        }  
    }

    validateFolder() {
        const folder = this.state.folder_id;
        if (folder === '...') {
            return 'Please select a folder';
        }
    }

    componentDidMount() {
        const noteId = this.props.match.params.noteId
        fetch(`${config.API_ENDPOINT}/notes/${noteId}`, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(responseData => {
            this.setState({
                name: responseData.note_name,
                note_id: responseData.note_id,
                content: responseData.content,
                folder_id: responseData.folder_id,
                modified: responseData.modified
            })
            })
            .catch(error => {})
    }
    render() {
        const { folders=[] } = this.context
        return this.state.error.status ? <div className='error-container'><p><b>{this.state.errorMessage}</b></p></div> : (
            <section className='EditNote'>
                <h2>Edit Note</h2>
                <NotefulForm onSubmit={this.handleSubmit}>
                    <div className='field'>
                        <label htmlFor='edit-name-input'>
                            Name:
                        </label>
                        <input type='text' id='edit-name-input' name='edit-name' placeholder={this.state.name} defaultValue={this.state.name || ''} />
                    </div>
                    <div className='field'>
                        <label htmlFor='edit-content-input'>
                            Content:
                        </label>
                        <input type='text' id='edit-content-input' name='edit-content' placeholder={this.state.content} defaultValue={this.state.content || ''}/>
                    </div>
                    <div className='field'>
                        <label htmlFor='edit-folder-select'>
                            Select Folder:
                        </label>
                        <select id='edit-folder-select' name='edit-folder-id' placeholder={this.state.folder_id} >
                            
                            {folders.map(folder =>
                                    this.context.folders.map(folderToMatch => {
                                        return folderToMatch.folder_name === folder.folder_name ? <option value={this.state.folder_id}>{folderToMatch.folder_name}</option> : <option key={folder.folder_id} value={folder.folder_id}>{folder.folder_name}</option>
                                    })
                            )}
                        </select>
                    </div>
                    <div className='buttons'>
                        <button type='submit'>
                            Edit note
                        </button>
                    </div>
                </NotefulForm>
            </section>
        )
    }
}

EditNote.propTypes = {
    history: PropTypes.object
    
}