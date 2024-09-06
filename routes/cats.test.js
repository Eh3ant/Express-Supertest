process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require('../app');
let cats = require('../fakeDb')

let pickles = { name: "Pickles" };

beforeEach(function () {
    cats.push(pickles)
});

afterEach(function () {
    cats.length = 0;
})

describe("GET /cats", () => {
    test("Get all cats", async () => {
        const resp = await request(app).get("/cats");
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual({ cats: [pickles] })
    });
});
describe("GET /cats/:name", () => {
    test("Get aby name", async () => {
        const resp = await request(app).get(`/cats/${pickles.name}`);
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual({ cat: pickles })
    });
    test("Responds with 404 for invalid cat", async () => {
        const resp = await request(app).get(`/cats/mocha`);
        expect(resp.statusCode).toBe(404)
    });
});

describe("POST /cats", () => {
    test("Creating a cat", async () => {
        const resp = await request(app).post("/cats").send({ name: "Blue" });
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({ cat: { name: "Blue" } });
    })
    test("Responds with 400 if name is missing", async () => {
        const resp = await request(app).post("/cats").send({});
        expect(resp.statusCode).toBe(400);
    })
})

describe("PATCH /cats/:name", () => {
    test("updates a single cat name", async () => {
        const resp = await request(app).patch(`/cats/${pickles.name}`).send({ name: 'Monster' })
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual({ cat: { name: "Monster" } })
    })
    test("Response with 404 for invalid name", async () => {
        const resp = await request(app).patch(`/cats/piggles`).send({ name: 'Monster' })
        expect(resp.statusCode).toBe(404)
    })
})

describe("DELETE /cats/:name", () => {
    test("Delete a cat", async () => {
        const resp = await request(app).delete(`/cats/${pickles.name}`)
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({ message: 'deleted' })
    })
    test("Responds with 404 for deleting invalid cat", async () => {
        const resp = await request(app).delete(`/cats/mocha`)
        expect(resp.statusCode).toBe(404);
    })
})