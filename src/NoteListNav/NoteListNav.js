import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CircleButton from '../CircleButton/CircleButton'
import ApiContext from '../ApiContext'
import './NoteListNav.css'
import Folder from './Folder'

export default class NoteListNav extends React.Component {
    static defaultProps = {
        history: {push: () => {}}
    }

    state = {
        edit: false
    }

    handleDelete = () => {
        this.props.history.push('/')
    }

    handleEdit = () => {
        this.setState({
            edit: !this.state.edit ? true : false
        })
    }

    

    static contextType = ApiContext;

    render() {
        const { folders=[] } = this.context
        return (
            <div className='NoteListNav'>
                
                <ul className='NoteListNav__list'>
                    {folders.map((folder, idx) => {
                    const path = this.state.edit ? `/edit-folder/${folder.folder_id}` : `/folder/${folder.folder_id}`
                    return (
                            <li key={folder.folder_id}>
                                <NavLink
                                    key={folder.folder_id}
                                    className='NoteListNav__folder-link'
                                    to={path}
                                >
                                    <Folder key={folder.folder_id} folder_id={folder.folder_id} folder_name={folder.folder_name} deleteFolder={this.handleDelete} editFolder={this.handleEdit}/>
                                </NavLink>
                                
                            </li>
                        )}
                    )}
                </ul>
                <div className='NoteListNav__button-wrapper'>
                    <CircleButton
                        tag={Link}
                        to='/add-folder'
                        type='button'
                        className='NoteListNav__add-folder-button'
                    >
                        <FontAwesomeIcon icon='plus' />
                        <br />
                        Folder
                    </CircleButton>
                    <CircleButton
                        type='button'
                        className='NoteListNav__add-folder-button'
                        onClick={this.handleEdit}
                    >
                        {this.state.edit ? 'Select Folder' : 'Edit Folders'}
                    </CircleButton>
                </div>
            </div>
        )
    }
}
