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

// describe("", ()=>{
//     test("Blah", ()=>{
//         console.log(testUser);
//         expect(1).toBe(1);
//     })
// })

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

// POST /users
describe("POST /users", ()=>{
    test("Creates a new user", async()=>{
        const res = await request(app).post('/users').send({name: 'Billy', type: 'staff'});
        expect(res.status).toBe(201);
        expect(res.body).toEqual({
            user:{
                name:'Billy',
                type:'staff',
                id: expect.any(Number)
            }
        })
    })
})

// PATCH /users/:id
describe("PATCH /users", ()=>{
    test("Updates a single user", async()=>{
        const res = await request(app).patch(`/users/${testUser.id}`).send({name: 'Billy', type: 'admin'});
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            user:{
                name:'Billy',
                type:'admin',
                id: expect.any(Number)
            }
        })
    })
    test("Responds with 400 with invalid id", async()=>{
        const res = await request(app).patch(`/users/404`).send({name: 'Billy', type: 'admin'});
        expect(res.status).toBe(400);
    })
})

describe("DELETE /users/:id", ()=>{
    test("Delete a user", async()=>{
        const res = await request(app).delete(`/users/${testUser.id}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            msg: "DELETED!"
        })
    })
})