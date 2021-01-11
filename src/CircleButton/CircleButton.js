import React from 'react'
import PropTypes from 'prop-types'
import './CircleButton.css'

export default function NavCircleButton(props) {
    const { tag, className, childrenm, ...otherProps } = props

    return React.createElement(
        props.tag,
        {
            className: ['NavCircleButton', props.className].join(' '),
            ...otherProps
        },
        props.children
    )
}

NavCircleButton.defaultProps ={
    tag: 'a',
}

NavCircleButton.propTypes = {
    className: PropTypes.string,
    type: PropTypes.string.isRequired,
    tag: PropTypes.func.isRequired,
    to: PropTypes.string.isRequired
}