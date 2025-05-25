const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = require('../app');
const api = supertest(app);

const helper = require('./test_helper');
const Blog = require('../models/blog');
const User = require('../models/user');

const createTestUserAndToken = async () => {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash('testpassword', saltRounds);
  const userForTest = new User({ username: 'root', passwordHash });
  await userForTest.save();

  const user = await User.findOne({ username: 'root' });
  const userForToken = { username: user.username, id: user._id };
  const token = jwt.sign(userForToken, process.env.SECRET);
  return { user, token };
};

describe('when there are some blogs saved initially', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});

    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog);
      await blogObject.save();
    }
  });

  test('the correct amount of blog posts are returned as JSON', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test('the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs');

    const no_idButId = response.body.filter(
      value => Object.keys(value).includes('id') & !Object.keys(value).includes('_id')
    );

    assert(no_idButId);
  });

  describe('addition of a new blog', () => {
    test('a valid blog post can be added', async () => {
      const { token } = await createTestUserAndToken();

      const newBlog = {
        title: 'Fullstackopen is good',
        author: 'me',
        url: 'some url',
        likes: 5
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const response = await api.get('/api/blogs');
      assert.strictEqual(response.body.length, helper.initialBlogs.length + 1);

      const titles = response.body.map(b => b.title);
      assert(titles.includes('Fullstackopen is good'));
    });

    test('the likes property will default to the value 0', async () => {
      const { token } = await createTestUserAndToken();

      const newBlog = {
        title: 'Fullstackopen is good',
        author: 'me',
        url: 'some url',
      };

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog);

      assert.strictEqual(response.body.likes, 0);
    });

    test('blog without title is not added', async () => {
      const { token } = await createTestUserAndToken();

      const newBlogWoTitle = {
        author: 'me',
        url: 'some url',
        likes: 1
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlogWoTitle)
        .expect(400);

      const response = await api.get('/api/blogs');
      assert.strictEqual(response.body.length, helper.initialBlogs.length);
    });

    test('blog without url is not added', async () => {
      const { token } = await createTestUserAndToken();

      const newBlogWoUrl = {
        title: 'Fullstackopen is good',
        author: 'me',
        likes: 1
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlogWoUrl)
        .expect(400);

      const response = await api.get('/api/blogs');
      assert.strictEqual(response.body.length, helper.initialBlogs.length);
    });

    test('adding a blog without a token fails with 401 Unauthorized', async () => {
      const newBlog = {
        title: 'Fullstackopen is good',
        author: 'me',
        url: 'some url',
        likes: 5
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/);

      const response = await api.get('/api/blogs');
      assert.strictEqual(response.body.length, helper.initialBlogs.length);
    });
  });
  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const { user, token } = await createTestUserAndToken();

      const newBlog = new Blog({
        title: 'Fullstackopen is good',
        author: 'me',
        url: 'some url',
        likes: 5,
        user: user._id
      });

      const savedBlog = await newBlog.save();
      user.blogs = user.blogs.concat(savedBlog._id);
      await user.save();

      const blogsAtStart = await helper.blogsInDb();

      await api
        .delete(`/api/blogs/${savedBlog._id.toString()}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);

      const titles = blogsAtEnd.map(blog => blog.title);
      assert(!titles.includes(savedBlog.title));
      const userAtEnd = await User.findOne({ username: 'root' });
      const blogsOfUser = userAtEnd.blogs.map(blog => blog.toString());
      assert(!blogsOfUser.includes(savedBlog._id.toString()));
    });
  });
  describe('update of a blog', () => {
    test('update the number of likes for a blog post', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];

      const newBlogLikes = {
        likes: 520
      };

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(newBlogLikes)
        .expect(200);

      assert.strictEqual(newBlogLikes.likes, response.body.likes);
      assert.strictEqual(blogToUpdate.title, response.body.title);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});

