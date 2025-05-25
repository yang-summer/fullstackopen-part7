import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';
import { describe } from 'vitest';

describe('<BlogForm />', () => {
  test('<BlogForm /> calls onSubmit with the right details', async () => {
    const blogInput = {
      author: 'Joel Spolsky',
      title: 'The Joel Test: 12 Steps to Better Code',
      url: 'https://www.dummy.com',
    };

    const user = userEvent.setup();
    const createBlog = vi.fn();

    render(<BlogForm createBlog={createBlog} />);

    const titleInput = screen.getByTestId('titleInput');
    const authorInput = screen.getByTestId('authorInput');
    const urlInput = screen.getByTestId('urlInput');
    const submitButton = screen.getByText('create');

    await user.type(titleInput, blogInput.title);
    await user.type(authorInput, blogInput.author);
    await user.type(urlInput, blogInput.url);
    await user.click(submitButton);

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0].title).toBe(blogInput.title);
    expect(createBlog.mock.calls[0][0].author).toBe(blogInput.author);
    expect(createBlog.mock.calls[0][0].url).toBe(blogInput.url);
  });
});
