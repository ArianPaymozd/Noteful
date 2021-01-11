import React from 'react';
import PropTypes from 'prop-types'
import './ValidationError.css'

export default class ValidationError extends React.Component {
    render() {
        if(this.props.message) {
            return (
                <div className="error">
                    <p><b>{this.props.message}</b></p>
                </div>
        );
    }
        return <></>
    }
    
}

ValidationError.propTypes = {
    message: PropTypes.string
}