const request = require('supertest');
const app = require('../src/app');

describe('Auth API Testleri', () => {
  it('POST /auth/register isteği', async () => {
    const res = await request(app).post('/auth/register').send({
      username: 'testuser',
      password: 'password',
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual('User registered successfully');
  });

  it('POST /auth/login isteği', async () => {
    const res = await request(app).post('/auth/login').send({
      username: 'testuser',
      password: 'password',
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined();
  });
});

describe('Blog API Testleri', () => {
  let token = '';

  beforeAll(async () => {
    const res = await request(app).post('/auth/login').send({
      username: 'testuser',
      password: 'password',
    });
    token = res.body.token;
  });

  it('POST /api/blog-posts isteği', async () => {
    const res = await request(app)
      .post('/api/blog-posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Blog Post', content: 'This is a test blog post' });
    expect(res.statusCode).toEqual(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.title).toEqual('Test Blog Post');
    expect(res.body.content).toEqual('This is a test blog post');
  });

  it('GET /api/blog-posts isteği', async () => {
    const res = await request(app).get('/api/blog-posts');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('PUT /api/blog-posts/:blogPostId isteği', async () => {
    const createResponse = await request(app)
      .post('/api/blog-posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Blog Post', content: 'This is a test blog post' });

    const res = await request(app)
      .put(`/api/blog-posts/${createResponse.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Blog Post', content: 'This blog post has been updated' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(createResponse.body.id);
    expect(res.body.title).toEqual('Updated Blog Post');
    expect(res.body.content).toEqual('This blog post has been updated');
  });

  it('DELETE /api/blog-posts/:blogPostId isteği', async () => {
    const createResponse = await request(app)
      .post('/api/blog-posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Blog Post', content: 'This is a test blog post' });

    const res = await request(app)
      .delete(`/api/blog-posts/${createResponse.body.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(204);
  });
});
