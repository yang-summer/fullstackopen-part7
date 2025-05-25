import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';
import { describe, expect } from 'vitest';

describe('<Blog />', () => {
  const blog = {
    id: '5a43fde2cbd20b12a2c34e91',
    user: {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
    },
    likes: 0,
    author: 'Joel Spolsky',
    title: 'The Joel Test: 12 Steps to Better Code',
    url: 'https://www.dummy.com',
  };

  test('render title and author by default.', async () => {
    render(<Blog blog={blog} />);
    const div = screen.getByTestId('blog');
    expect(div).toHaveTextContent(`${blog.title} ${blog.author}`);
  });

  test('does not render URL or number of likes by default.', async () => {
    render(<Blog blog={blog} />);
    const div = screen.getByTestId('blog');
    expect(div).not.toHaveTextContent(`${blog.url}`);
    expect(div).not.toHaveTextContent(`likes ${blog.likes}`);
  });

  test('after clicking the button, details are displayed', async () => {
    render(<Blog blog={blog} />);
    const user = userEvent.setup();
    const button = screen.getByText('view');
    await user.click(button);

    const div = screen.getByTestId('blog');
    expect(div).toHaveTextContent(`${blog.url}`);
    expect(div).toHaveTextContent(`likes ${blog.likes}`);
  });

  test('click the like button twice, onClick is called twice.', async () => {
    const user = userEvent.setup();
    const updateBlog = vi.fn();

    render(<Blog blog={blog} updateBlog={updateBlog} />);

    const button = screen.getByText('view');
    await user.click(button);
    const likeButton = screen.getByText('like');
    await user.click(likeButton);
    await user.click(likeButton);

    expect(updateBlog.mock.calls).toHaveLength(2);
  });
});
