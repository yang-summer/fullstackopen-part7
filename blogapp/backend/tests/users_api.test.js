const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const app = require('../app');
const api = supertest(app);

const helper = require('./test_helper');
const User = require('../models/user');

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const saltRounds = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('testpassword', saltRounds);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'changyi',
      name: 'ycy',
      password: '123456',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map(u => u.username);
    assert(usernames.includes(newUser.username));
  });

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'spueruser',
      password: '123456',
    };
    // an invalid add user operation returns a suitable status code
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
    // an invalid add user operation returns a suitable error message
    assert(result.body.error.includes('expected `username` to be unique'));

    const usersAtEnd = await helper.usersInDb();
    // ensure invalid users are not created
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test('creation fails with proper statuscode and message if the length of username shorter than 3', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'r',
      name: 'spueruser',
      password: '123456',
    };
    // an invalid add user operation returns a suitable status code
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    // ensure invalid users are not created
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test('creation fails with proper statuscode and message if password is not given', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'test',
      name: 'spueruser',
    };
    // an invalid add user operation returns a suitable status code
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    // an invalid add user operation returns a suitable error message
    assert(result.body.error.includes('password must be given'));

    const usersAtEnd = await helper.usersInDb();
    // ensure invalid users are not created
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test('creation fails with proper statuscode and message if password is less than 3 chars', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'test',
      name: 'spueruser',
      password: '12'
    };
    // an invalid add user operation returns a suitable status code
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    // an invalid add user operation returns a suitable error message
    assert(result.body.error.includes('password must be at least 3 characters long'));

    const usersAtEnd = await helper.usersInDb();
    // ensure invalid users are not created
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});