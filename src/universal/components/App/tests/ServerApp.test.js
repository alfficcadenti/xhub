import {shallow} from 'enzyme/build';
import serverApp from '../ServerApp.js';
import {expect} from 'chai';

describe('<ServerApp />', () => {
    const wrapper = shallow(serverApp('https://localhost:8080/'));

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });
});
