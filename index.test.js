const request = require('supertest');
const app = require('./app');

describe('User API', () => {
  let userId;

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const user = {
        name: 'Sugam Devadiga',
        email: 'sugam@gmail.com',
        age: 30
      };
      const response = await request(app)
        .post('/users')
        .send(user);
      expect(response.status).toBe(200);
      expect(response.body.name).toBe(user.name);
      expect(response.body.email).toBe(user.email);
      expect(response.body.age).toBe(user.age);
      userId = response.body._id;
    });
  });

  describe('PUT /users/:id', () => {
    it('should update an existing user', async () => {
      const updatedUser = {
        name: 'Sugam Devadiga',
        email: 'sugam@gmail.com',
        age: 35
      };
      const response = await request(app)
        .put(`/users/${userId}`)
        .send(updatedUser);
      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updatedUser.name);
      expect(response.body.email).toBe(updatedUser.email);
      expect(response.body.age).toBe(updatedUser.age);
    });

    it('should return a 404 error for non-existing user ID', async () => {
      const nonExistingId = '123456789012345678901234';
      const updatedUser = {
        name: 'Sugam Devadiga',
        email: 'sugam@gmail.com',
        age: 35
      };
      const response = await request(app)
        .put(`/users/${nonExistingId}`)
        .send(updatedUser);
      expect(response.status).toBe(404);
      expect(response.text).toBe('User not found');
    });
  });

  describe('GET /users', () => {
    it('should retrieve a list of users', async () => {
      const response = await request(app)
        .get('/users');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});