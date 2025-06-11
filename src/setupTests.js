// filepath: src/setupTests.js
import '@testing-library/jest-dom';

// Mock Konva for testing
jest.mock('konva', () => ({
  Stage: jest.fn(),
  Layer: jest.fn(),
  Group: jest.fn(),
  Rect: jest.fn(),
  Circle: jest.fn(),
  Line: jest.fn(),
  Text: jest.fn()
}));

jest.mock('react-konva', () => ({
  Stage: ({ children, ...props }) => <div data-testid="konva-stage" {...props}>{children}</div>,
  Layer: ({ children, ...props }) => <div data-testid="konva-layer" {...props}>{children}</div>,
  Group: ({ children, ...props }) => <div data-testid="konva-group" {...props}>{children}</div>,
  Rect: (props) => <div data-testid="konva-rect" {...props} />,
  Circle: (props) => <div data-testid="konva-circle" {...props} />,
  Line: (props) => <div data-testid="konva-line" {...props} />,
  Text: (props) => <div data-testid="konva-text" {...props} />
}));
