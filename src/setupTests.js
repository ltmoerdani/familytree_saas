// filepath: src/setupTests.js
import '@testing-library/jest-dom';
import PropTypes from 'prop-types';

// Mock Konva for testing
jest.mock('konva', () => ({
  Stage: jest.fn(),
  Layer: jest.fn(),
  Group: jest.fn(),
  Rect: jest.fn(),
  Circle: jest.fn(),
  Line: jest.fn(),
  Text: jest.fn(),
}));

// Mock components with proper PropTypes validation
const MockStage = ({ children, ...props }) => (
  <div data-testid="konva-stage" {...props}>
    {children}
  </div>
);
MockStage.propTypes = { children: PropTypes.node };

const MockLayer = ({ children, ...props }) => (
  <div data-testid="konva-layer" {...props}>
    {children}
  </div>
);
MockLayer.propTypes = { children: PropTypes.node };

const MockGroup = ({ children, ...props }) => (
  <div data-testid="konva-group" {...props}>
    {children}
  </div>
);
MockGroup.propTypes = { children: PropTypes.node };

const MockRect = props => <div data-testid="konva-rect" {...props} />;
const MockCircle = props => <div data-testid="konva-circle" {...props} />;
const MockLine = props => <div data-testid="konva-line" {...props} />;
const MockText = props => <div data-testid="konva-text" {...props} />;

jest.mock('react-konva', () => ({
  Stage: MockStage,
  Layer: MockLayer,
  Group: MockGroup,
  Rect: MockRect,
  Circle: MockCircle,
  Line: MockLine,
  Text: MockText,
}));
