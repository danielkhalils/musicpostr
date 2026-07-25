import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import communityfeed from './communityfeed';

describe('<communityfeed />', () => {
  test('should mount', () => {
    render(<communityfeed />);

    const communityfeed = screen.getByTestId('communityfeed');

    expect(communityfeed).toBeInTheDocument();
  });
});