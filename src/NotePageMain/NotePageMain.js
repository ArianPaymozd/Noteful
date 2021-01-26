import React from 'react'
import Note from '../Note/Note'
import ApiContext from '../ApiContext'
import { findNote } from '../notes-helpers'
import {Link} from 'react-router-dom'
import './NotePageMain.css'

export default class NotePageMain extends React.Component {
    static defaultProps = {
        match: {
            params: {}
        },
        history: {push: () => {}}
    }
    static contextType = ApiContext

    handleDeleteNote = () => {
        this.props.history.push(`/`)
    }

    render() {
        const { notes=[] } = this.context
        const noteId = parseInt(this.props.match.params.noteId)
        const note = findNote(notes, noteId) || { content: '' }
        return (
            <section className='NotePageMain'>
                {   
                    note === { content: '' } 
                    ? ''
                    : <Note
                        id={note.note_id}
                        name={note.note_name}
                        modified={note.modified}
                        onDeleteNote={this.handleDeleteNote}
                    />
                }
                <h4 className='edit-button'>
                    <Link to={`/edit-note/${note.note_id}`}>
                        edit note
                    </Link>
                </h4>
                <div className='NotePageMain_content'>
                    {note.content.split(/\n \r|\n/).map((para, i) =>
                        <p key={i}>{para}</p>
                    )}
                </div>
            </section>
        )
    }
}
