const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const chai = require('chai');
const sinon = require('sinon');
const chaiJestSnapshot = require('chai-jest-snapshot');
require('jest-fetch-mock').enableMocks();

Enzyme.configure({ adapter: new Adapter() });
chai.use(chaiJestSnapshot);
chai.use(require('sinon-chai'));
