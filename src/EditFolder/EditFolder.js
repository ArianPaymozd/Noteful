import React from 'react'
import PropTypes from 'prop-types'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import config from '../config'
import './EditFolder.css'
import ValidationError from '../ValidateError/ValidationError'

export default class EditFolder extends React.Component {
    static defaultProps = {
        match: {
            params: {}
        },
        history: {push: () => {}}
    }

    state = {
        error: {status: false, message: ''},
        touched: false,
        name: ''
    }

    static contextType = ApiContext;

    handleSubmit = (e) => {
        e.preventDefault()
        const newFolder = {
            folder_name: e.target['folder-name'].value
        }
        this.setState({
            name: newFolder.folder_name,
            touched: true
        })
        if (newFolder.folder_name.length > 0) {
            fetch(`${config.API_ENDPOINT}/folders/${this.state.folder_id}`, {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(newFolder),
            })
            .then(res => {
                if (!res.ok) {
                    this.setState({
                        error: {message: `${res.status}: ${res.statusText}`},
                    })
                    return res.json().then((e) => Promise.reject(e))
                }
                return res.json()
            })
            .then(folder => {
                folder.folder_id = this.state.folder_id
                this.context.editFolder(folder)
                this.props.history.push(`/`)
            })
            .catch(error => {
                this.setState({
                    error: {status: true}
                })
            })
        }
    }

    validateName() {
        const name = this.state.name.trim();
        if (name.length === 0) {
            return 'Name is required';
        }
    }

    componentDidMount() {
        const folderId = this.props.match.params.folderId
        fetch(`${config.API_ENDPOINT}/folders/${folderId}`, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(responseData => {
                this.setState({
                    name: responseData.folder_name,
                    folder_id: responseData.folder_id,
                })
            })
            .catch(error => {})
    }

    render() {
        return this.state.error.status ? <div className='error-container'><p><b>{this.state.errorMessage}</b></p></div> : (
            <section className='EditFolder'>
                <h2>Edit Folder</h2>
                <NotefulForm onSubmit={this.handleSubmit}>
                    <div className='field'>
                        <label htmlFor='folder-name-input'>
                            Folder Name:
                        </label>
                        <input type='text' id='folder-name-input' name='folder-name' defaultValue={this.state.name}/>
                    </div>
                    {this.state.touched && this.state.name.length === 0 ? <ValidationError message={this.validateName()}/> : ''}
                    <div className='buttons'>
                        <button type='submit'>
                            Edit Folder
                        </button>
                    </div>
                </NotefulForm>
            </section>
        )
    }
}

EditFolder.propTypes = {
    history: PropTypes.object
    
}