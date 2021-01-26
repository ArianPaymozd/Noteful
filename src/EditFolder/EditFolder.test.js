import React from 'react';
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import EditFolder from './EditFolder';

describe(`EditFolder component`, () => {

    it('renders the complete form', () => {
        const wrapper = shallow(<EditFolder />)
        expect(toJson(wrapper)).toMatchSnapshot()
    })
})
