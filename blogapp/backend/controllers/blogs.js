const jwt = require('jsonwebtoken');
const middleware = require('../utils/middleware');
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 });
  response.json(blog);
});

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body;
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }
  const user = request.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    user: user._id
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  // validate token
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }
  // is the user the creator
  const blog = await Blog.findById(request.params.id);
  const user = request.user;
  if (blog.user.toString() !== user._id.toString()) {
    return response.status(403).json({ error: 'not the creator' });
  }
  // delete blog
  await Blog.findByIdAndDelete(request.params.id);
  // update user
  user.blogs = user.blogs.filter(value => value.toString() !== blog._id.toString());
  await user.save();

  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes: blog.likes + 1 },
    { new: true }
  );
  response.json(updatedBlog);
});

blogsRouter.post('/:id/comments', async (request, response) => {
  const { comment } = request.body;

  if (!comment || typeof comment !== 'string' || comment.trim() === '') {
    return response.status(400).json({ error: 'Comment content is missing or invalid' });
  }

  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response.status(404).json({ error: 'Blog not found' });
  }

  blog.comments.push(comment); // 将新评论添加到数组
  const updatedBlog = await blog.save();

  // 返回更新后的博客，或者仅返回评论部分，取决于你的API设计
  response.status(201).json(updatedBlog);
});

module.exports = blogsRouter;