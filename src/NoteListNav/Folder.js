import React from 'react'
import config from '../config'
import ApiContext from '../ApiContext'
import {countNotesForFolder} from '../notes-helpers'

export default class Folder extends React.Component {
    

    static contextType = ApiContext

    handleClickDelete = e => {
        e.preventDefault()
        const folder_id = this.props.folder_id

        fetch(`${config.API_ENDPOINT}/folders/${folder_id}`, {
            method: 'DELETE',
            headers: {
            'content-type': 'application/json'
            },
        })
        .then(res => {
            if (!res.ok) {
                return res.then((e) => Promise.reject(e))
            }
            return res.status
        })
        .then(() => {
            this.context.deleteFolder(folder_id)
            this.props.deleteFolder()
            const newNotes = this.context.notes.filter(note => {
                return note.folder_id === this.props.folder_id
            })
            newNotes.map(note => this.context.deleteNote(note.note_id))
        })
        .catch(error => {
            console.error({error})
        })
    }

    render() {
        const {notes={}} = this.context
        return (
            <>
                <span className='NoteListNav__num-notes'>
                    {countNotesForFolder(notes, this.props.folder_id)}
                </span>
                <span className='folder_name'>{this.props.folder_name}</span>
                <br />
                <button
                    className='NoteListNav_delete'
                    type='button'
                    onClick={this.handleClickDelete}
                >
                    remove
                </button>
            </>
        )
    }
}