import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ApiContext from '../ApiContext'
import config from '../config'
import './Note.css'

class Note extends React.Component {
    static defaultProps = {
        onDeleteNote: () => {}
    }

    static contextType = ApiContext;

    handleClickDelete = e => {
        e.preventDefault()
        const noteId = this.props.id

        fetch(`${config.API_ENDPOINT}/notes/${noteId}`, {
            method: 'DELETE',
            headers: {
            'content-type': 'application/json'
            },
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then((e) => Promise.reject(e))
            }
            return res.json()
        })
        .then(() => {
            this.context.deleteNote(noteId)
            this.props.onDeleteNote(noteId)
        })
        .catch(error => {
            console.error({error})
        })
    }
    render() {
        const {name, id, modified} = this.props
        return (
            <div className='Note'>
                <h2 className='Note_title'>
                    <Link to={`/note/${id}`}>
                        {name}
                    </Link>
                </h2>
                <button
                    className='Note_delete'
                    type='button'
                    onClick={this.handleClickDelete}
                >
                    <FontAwesomeIcon icon='trash-alt' />
                    {' '}
                    remove
                </button>
                <div className='Note_dates'>
                    <div className='Note_dates-modified'>
                        Modified
                        {' '}
                        <span className='Date'>
                        {format(modified, 'Do MMM YYYY')}
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}

Note.propTypes = {
    onDeleteNote: PropTypes.func
}

export default Note