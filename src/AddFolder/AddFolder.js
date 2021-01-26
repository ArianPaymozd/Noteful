import React from 'react'
import PropTypes from 'prop-types'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import config from '../config'
import './AddFolder.css'
import ValidationError from '../ValidateError/ValidationError'

export default class AddFolder extends React.Component {
    static defaultProps = {
        history: {
            push: () => { }
        },
    }

    static contextType = ApiContext;

    state = {
        name: {
            value: ' ',
            touched: false
        },
        error: {
            status: false,
        },
        errorMessage: ''
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.setState({
            name: {value: e.target['folder-name'].value, touched: true}
        })
        const folder = {
            folder_name: e.target['folder-name'].value
        }
        if (folder.folder_name.split('').length > 0) {
            fetch(`${config.API_ENDPOINT}/folders`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(folder),
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
            .then(folder => {
                this.context.addFolder(folder)
                this.props.history.push(`/folder/${folder.folder_id}`)
            })
            .catch(error => {
                this.setState({
                    error: {
                        status: true,
                    }
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

    render() {
        return this.state.error.status ? <div className='error-container'><p><b>{this.state.errorMessage}</b></p></div> : (
            <section className='AddFolder'>
                <h2>Create Folder</h2>
                <NotefulForm onSubmit={this.handleSubmit}>
                    <div className='field'>
                        <label htmlFor='folder-name-input'>
                            Folder Name:
                        </label>
                        <input type='text' id='folder-name-input' name='folder-name' />
                    </div>
                    {this.state.name.touched && (
                        <ValidationError message={this.validateName()} />
                    )}
                    <div className='buttons'>
                        <button type='submit'>
                            Add Folder
                        </button>
                    </div>
                </NotefulForm>
            </section>
        )
    }
}

AddFolder.propTypes = {
    history: PropTypes.object
}