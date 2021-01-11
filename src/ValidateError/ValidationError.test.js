import React from 'react'
import {shallow} from 'enzyme'
import ValidationError from './ValidationError'
import toJson from 'enzyme-to-json'

describe('ValidateName component', () => {
    it('renders without crashing', () => {
        const wrapper = shallow(<ValidationError message={'hello'}/>)
        expect(toJson(wrapper)).toMatchSnapshot()
    })
})