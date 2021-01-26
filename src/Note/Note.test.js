import React from 'react';
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import Note from './Note'

describe(`Note component`, () => {
    const props = {
        id: 'a',
        name: 'test-class-name',
        modified: new Date(2020, 12, 25),
    }

    it('renders the Note given props', () => {
        const wrapper = shallow(<Note {...props} />)
        expect(toJson(wrapper)).toMatchSnapshot()
    })
})
