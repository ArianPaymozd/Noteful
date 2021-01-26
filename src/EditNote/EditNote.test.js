import React from 'react';
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import EditNote from './EditNote';

describe(`EditNote component`, () => {
    it('renders the complete form', () => {
        const wrapper = shallow(<EditNote />)
        expect(toJson(wrapper)).toMatchSnapshot()
    })
})
