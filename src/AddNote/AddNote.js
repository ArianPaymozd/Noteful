import React from 'react'
import PropTypes from 'prop-types'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import config from '../config'
import './AddNote.css'
import ValidationError from '../ValidateError/ValidationError'

export default class AddNote extends React.Component {
    static defaultProps = {
        history: {
            push: () => { }
        },
    }

    static contextType = ApiContext;

    state = {
        name: {
            value: '',
            touched: false
        },
        content: {
            value: '',
            touched: false
        },
        folder: {
            name: '',
            touched: false
        },
        error: {status: false},
        errorMessage: ''
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.setState({
            name: {value: e.target['note-name'].value, touched: true},
            content: {value: e.target['note-content'].value, touched: true},
            folder: {value: e.target['note-folder-id'].value, touched: true}
        })
        const newNote = {
            name: e.target['note-name'].value,
            content: e.target['note-content'].value,
            folderId: e.target['note-folder-id'].value,
            modified: new Date(),
        }
        console.log(newNote.folderId)
        if (newNote.name.split('').length > 0 && newNote.content.split('').length > 0 && newNote.folderId !== '...') {
            fetch(`${config.API_ENDPOINT}/notes`, {
                method: 'POST',
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
                this.context.addNote(note)
                this.props.history.push(`/folder/${note.folderId}`)
            })
            .catch(error => {
                this.setState({
                    error: {status: true}
                })
            })
        }  
    }

    validateName() {
        const name = this.state.name.value.trim();
        if (name.length === 0) {
            return 'Name is required';
        }
    }

    validateContent() {
        const content = this.state.content.value.trim();
        if (content.length === 0) {
            return 'Content is required';
        }
    }

    validateFolder() {
        const folder = this.state.folder.value;
        if (folder === '...') {
            return 'Please select a folder';
        }
    }

    render() {
        const { folders=[] } = this.context
        return this.state.error.status ? <div className='error-container'><p><b>{this.state.errorMessage}</b></p></div> : (
            <section className='AddNote'>
                <h2>Create Note</h2>
                <NotefulForm onSubmit={this.handleSubmit}>
                    <div className='field'>
                        <label htmlFor='note-name-input'>
                            Name:
                        </label>
                        <input type='text' id='note-name-input' name='note-name' />
                    </div>
                    {this.state.name.touched && (
                        <ValidationError message={this.validateName()} />
                    )}
                    <div className='field'>
                        <label htmlFor='note-content-input'>
                            Content:
                        </label>
                        <textarea id='note-content-input' name='note-content' />
                    </div>
                    {this.state.content.touched && (
                        <ValidationError message={this.validateContent()} />
                    )}
                    <div className='field'>
                        <label htmlFor='note-folder-select'>
                            Select Folder:
                        </label>
                        <select id='note-folder-select' name='note-folder-id'>
                            <option value={null}>...</option>
                            {folders.map(folder =>
                                <option key={folder.id} value={folder.id}>
                                    {folder.name}
                                </option>
                            )}
                        </select>
                    </div>
                    {this.state.folder.touched && (
                        <ValidationError message={this.validateFolder()} />
                    )}
                    <div className='buttons'>
                        <button type='submit'>
                            Add note
                        </button>
                    </div>
                </NotefulForm>
            </section>
        )
    }
}

AddNote.propTypes = {
    history: PropTypes.object
    
}