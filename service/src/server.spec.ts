import * as fs from "fs/promises";
import supertest from "supertest";
import createServer from "./server";

const BASE_DIR_TEST = "./test";
const TMP_DIR = `${BASE_DIR_TEST}/uploads`;

const FILE_NAME_FIXTURE = "fixture.txt";
const FILE_NAME_SMALL = "small.jpg";
const FILE_NAME_LARGE = "large.jpg";

const FILE_PATH_SMALL = `${BASE_DIR_TEST}/${FILE_NAME_SMALL}`;
const FILE_PATH_LARGE = `${BASE_DIR_TEST}/${FILE_NAME_LARGE}`;

const app = createServer();

describe("Service API", () => {
  beforeEach(async () => {
    await fs.mkdir(TMP_DIR, { recursive: true });
    await fs.appendFile(
      `${TMP_DIR}/${FILE_NAME_FIXTURE}`,
      "This is a fixture."
    );
  });

  afterEach(async () => {
    await fs.rm(TMP_DIR, { recursive: true });
  });

  describe("GET /api/files", () => {
    it("should respond with list of files", async () => {
      const response = await supertest(app).get("/api/files");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            filename: FILE_NAME_FIXTURE,
          }),
        ])
      );
    });
  });

  describe("POST /api/files", () => {
    describe("when file is smaller than max size limit", () => {
      it("should respond 200", async () => {
        const responsePost = await supertest(app)
          .post("/api/files")
          .set("Content-Type", "multipart/form-data")
          .attach("file", FILE_PATH_SMALL);

        expect(responsePost.statusCode).toBe(200);
      });

      it("should create file", async () => {
        await supertest(app)
          .post("/api/files")
          .set("Content-Type", "multipart/form-data")
          .attach("file", FILE_PATH_SMALL);

        const responseGet = await supertest(app).get("/api/files");

        expect(responseGet.statusCode).toBe(200);
        expect(responseGet.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              filename: FILE_NAME_SMALL,
            }),
          ])
        );
      });
    });

    describe("when file is larger than max size limit", () => {
      it("should respond 500", async () => {
        const responsePost = await supertest(app)
          .post("/api/files")
          .set("Content-Type", "multipart/form-data")
          .attach("file", FILE_PATH_LARGE);

        expect(responsePost.statusCode).toBe(500);
      });

      it("should not create file", async () => {
        const responseGet = await supertest(app).get("/api/files");

        expect(responseGet.statusCode).toBe(200);
        expect(responseGet.body).toEqual(
          expect.arrayContaining([
            expect.not.objectContaining({
              filename: FILE_PATH_LARGE,
            }),
          ])
        );
      });
    });
  });

  describe("GET /api/files/:filename", () => {
    describe("when file can be found", () => {
      const filename = FILE_NAME_FIXTURE;

      it("should respond with 200 ", async () => {
        const response = await supertest(app).get(`/api/files/${filename}`);

        expect(response.statusCode).toBe(200);
      });
    });

    describe("when file cannot be found", () => {
      const filename = "garbage.file";

      it("should respond with 500", async () => {
        const response = await supertest(app).get(`/api/files/${filename}`);

        expect(response.statusCode).toBe(500);
      });
    });
  });
});
