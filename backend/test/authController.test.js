/**
 * @jest-environment node
 */

jest.mock("nodemailer", () => ({
    createTransport: jest.fn().mockReturnValue({
        sendMail: jest.fn().mockResolvedValue({ accepted: ["test@mail.com"] })
    })
}));

jest.mock("../middlewares/validator", () => ({
    signupValidation: { validate: jest.fn() },
    verificationCodeSchema: { validate: jest.fn() }
}));


const authController = require("../controllers/authController");
const User = require("../models/userModel");
const { doHash, doValidation, hmacProcess } = require("../middlewares/hasher");
const { signupValidation, verificationCodeSchema } = require("../middlewares/validator");
const { generateToken, userDetails } = require("../middlewares/jwtGenerator");
const transport = require("../middlewares/emailSender");
const crypto = require("crypto");

// Mock all external modules
jest.mock("../models/userModel");
jest.mock("../middlewares/hasher");
jest.mock("../middlewares/validator");
jest.mock("../middlewares/jwtGenerator");
jest.mock("../middlewares/emailSender");
jest.mock("crypto");

const mockReq = (body = {}) => ({ body });
const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.clearCookie = jest.fn().mockReturnValue(res);
    return res;
};

describe("Auth Controller", () => {

    // ---------------------
    // SIGNIN TESTS
    // ---------------------
    describe("signin", () => {
        it("should return 401 if email not found", async () => {
            User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });

            const req = mockReq({ email: "test@mail.com", password: "pass123" });
            const res = mockRes();

            await authController.signin(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "Invalid email or password" });
        });

        it("should return 401 for invalid password", async () => {
            User.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue({ password: "hashed" }),
            });

            doValidation.mockResolvedValue(false);

            const req = mockReq({ email: "test@mail.com", password: "wrong" });
            const res = mockRes();

            await authController.signin(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "Invalid email or password" });
        });

        it("should login successfully and call userDetails", async () => {
            User.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue({
                    id: "123",
                    email: "test@mail.com",
                    password: "hashed",
                }),
            });

            doValidation.mockResolvedValue(true);
            generateToken.mockResolvedValue("jwt-token");
            userDetails.mockResolvedValue(true);

            const req = mockReq({ email: "test@mail.com", password: "pass123" });
            const res = mockRes();

            await authController.signin(req, res);

            expect(generateToken).toHaveBeenCalledWith({
                userId: "123",
                email: "test@mail.com"
            });
            expect(userDetails).toHaveBeenCalledWith("jwt-token", res);
        });
    });

    // ---------------------
    // SIGNUP TESTS
    // ---------------------
    describe("signup", () => {
        it("should return 400 if validation fails", async () => {
            signupValidation.validate.mockReturnValue({
                error: { details: [{ message: "Invalid email format" }] }
            });

            const req = mockReq({ email: "bad" });
            const res = mockRes();

            await authController.signup(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith("Invalid email format");
        });

        it("should return 400 if user already exists", async () => {
            signupValidation.validate.mockReturnValue({ error: null });
            User.findOne.mockResolvedValue({ email: "exists@mail.com" });

            const req = mockReq({
                email: "exists@mail.com",
                password: "pass",
                gender: "Male",
                username: "john"
            });
            const res = mockRes();

            await authController.signup(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "User already exists"
            });
        });

        it("should create user and return token", async () => {
            signupValidation.validate.mockReturnValue({ error: null });
            User.findOne.mockResolvedValue(null);
            doHash.mockResolvedValue("hashedPass");

            const saveMock = jest.fn().mockResolvedValue({
                id: "123",
                email: "new@mail.com"
            });

            User.mockImplementation(() => ({ save: saveMock }));

            generateToken.mockResolvedValue("jwt-token");
            userDetails.mockResolvedValue(true);

            const req = mockReq({
                username: "john",
                email: "new@mail.com",
                gender: "Male",
                password: "pass"
            });
            const res = mockRes();

            await authController.signup(req, res);

            expect(doHash).toHaveBeenCalledWith("pass");
            expect(userDetails).toHaveBeenCalledWith("jwt-token", res);
        });
    });

    // ---------------------
    // SIGNOUT TEST
    // ---------------------
    describe("signout", () => {
        it("should clear cookie and return success", async () => {
            const req = mockReq();
            const res = mockRes();

            await authController.signout(req, res);

            expect(res.clearCookie).toHaveBeenCalledWith("Authorization");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "User logged out successfully"
            });
        });
    });

    // ---------------------
    // VERIFICATION EMAIL TEST
    // ---------------------
    describe("verificationEmail", () => {
        it("should return 404 if user not found", async () => {
            User.findOne.mockResolvedValue(null);

            const req = mockReq({ email: "none@mail.com" });
            const res = mockRes();

            await authController.verificationEmail(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Not a verified user" });
        });

        it("should send email and save hashed code", async () => {
            const saveMock = jest.fn();

            User.findOne.mockResolvedValue({
                email: "user@mail.com",
                save: saveMock
            });

            crypto.randomInt.mockReturnValue(123456);

            transport.sendMail.mockResolvedValue({
                accepted: ["user@mail.com"]
            });

            hmacProcess.mockReturnValue("hashedCode");

            const req = mockReq({ email: "user@mail.com" });
            const res = mockRes();

            await authController.verificationEmail(req, res);

            expect(transport.sendMail).toHaveBeenCalled();
            expect(saveMock).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    // ---------------------
    // VERIFY CODE TEST
    // ---------------------
    describe("verifyCode", () => {
        it("should return 400 if validation fails", async () => {
            verificationCodeSchema.validate.mockReturnValue({
                error: { details: [{ message: "Invalid" }] }
            });

            const req = mockReq({});
            const res = mockRes();

            await authController.verifyCode(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith("Invalid");
        });

        it("should return 400 if user not found", async () => {
            verificationCodeSchema.validate.mockReturnValue({ error: null });
            User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });

            const req = mockReq({ email: "none@mail.com", providedCode: "123456" });
            const res = mockRes();

            await authController.verifyCode(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it("should return 401 if code expired", async () => {
            verificationCodeSchema.validate.mockReturnValue({ error: null });

            User.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue({
                    verificationCodeExpiry: Date.now() - 1000
                })
            });

            const req = mockReq({ email: "test@mail.com", providedCode: "123456" });
            const res = mockRes();

            await authController.verifyCode(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
        });

        it("should verify successfully", async () => {
            verificationCodeSchema.validate.mockReturnValue({ error: null });

            const saveMock = jest.fn();

            User.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue({
                    verificationCodeExpiry: Date.now() + 5000,
                    verificationCode: "hashedCode",
                    save: saveMock
                })
            });

            hmacProcess.mockReturnValue("hashedCode");

            const req = mockReq({
                email: "test@mail.com",
                providedCode: "123456"
            });
            const res = mockRes();

            await authController.verifyCode(req, res);

            expect(saveMock).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});
