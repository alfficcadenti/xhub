const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const chai = require('chai');
const chaiJestSnapshot = require('chai-jest-snapshot');

Enzyme.configure({ adapter: new Adapter() });
chai.use(chaiJestSnapshot);