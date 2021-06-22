process.env.NODE_ENV = 'test';

const request= require('supertest');
const app = require('../app');
const db = require('../db');

let testUser;

beforeEach(async ()=>{
    const result = await db.query(`INSERT INTO users (name, type) 
    VALUES ('Peanuts', 'admin')
    RETURNING id, name, type`);
    testUser = result.rows[0];
})

afterEach(async ()=>{
    const result = await db.query(`DELETE FROM users`);
})

afterAll(async ()=>{
    await db.end();
})

describe("", ()=>{
    test("Blah", ()=>{
        console.log(testUser);
        expect(1).toBe(1);
    })
})

// GET /users
describe("GET /users", ()=>{
    test("GET a list with one user", async ()=>{
        const res = await request(app).get('/users');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({users:[testUser]})
    })
})

// GET /users/:id
describe("GET /users/:id", ()=>{
    test("Gets a single user", async()=>{
        const res = await request(app).get(`/users/${testUser.id}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({user: testUser})
    })
    test("Responds with 404 for invalid id", async()=>{
        const res = await request(app).get('/users/404');
        expect(res.status).toBe(404);
    })
})
