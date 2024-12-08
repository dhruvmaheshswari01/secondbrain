"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const zod_1 = __importDefault(require("zod"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const zod_2 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const middleware_1 = require("./middleware");
const generateLink_1 = require("./generateLink");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
const signupSchema = zod_1.default.object({
    username: zod_1.default.string().min(3, { message: "Username must be atleast 3 characters long." }),
    password: zod_1.default.string().min(8, { message: "Password must be atleast 8 characters long." })
});
;
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = signupSchema.parse(req.body);
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        yield db_1.userModel.create({
            username: username,
            password: hashedPassword
        });
        res.status(201).json({
            message: "User Signed In"
        });
    }
    catch (error) {
        if (error instanceof zod_2.ZodError) {
            res.status(400).json({
                message: "Validation error.",
                errors: error.errors,
            });
        }
        else if (error.code === 11000) {
            res.status(409).json({
                message: "User already exists.",
            });
        }
        else {
            res.status(500).json({
                message: "Internal server error.",
            });
        }
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = signupSchema.parse(req.body);
        const user = (yield db_1.userModel.findOne({ username }));
        if (user) {
            const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
            if (isPasswordValid) {
                const token = jsonwebtoken_1.default.sign({
                    id: user._id
                }, JWT_SECRET);
                res.json({
                    token
                });
            }
            else {
                res.status(403).json({
                    message: "Incorrrect credentials"
                });
            }
        }
        else {
            res.status(403).json({
                message: "Incorrrect credentials"
            });
        }
    }
    catch (error) {
        if (error instanceof zod_1.default.ZodError) {
            res.status(400).json({
                message: "Validation error.",
                errors: error.errors,
            });
        }
        else {
            res.status(500).json({
                message: "Internal server error.",
            });
        }
    }
}));
app.post("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.contentModel.create({
        link: req.body.link,
        type: req.body.type,
        title: req.body.title,
        userId: req.userId
    });
    res.json({
        message: "Content added"
    });
}));
app.get("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const content = yield db_1.contentModel.find({
        userId: userId
    }).populate("userId", "username");
    res.json({
        content
    });
}));
app.delete("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contentId = req.body.contentId;
        yield db_1.contentModel.deleteOne({
            _id: contentId,
            userId: req.userId,
        });
        res.status(200).json({
            message: "Content deleted successfully.",
        });
    }
    catch (error) {
        console.error("Error deleting content:", error);
        res.status(500).json({
            message: "Internal server error.",
        });
    }
}));
app.post("/api/v1/brain/share", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const share = req.body.share;
    if (share) {
        const existingLink = yield db_1.linkModel.findOne({
            userId: req.userId
        });
        if (existingLink) {
            res.json({
                hash: existingLink.hash
            });
            return;
        }
        const hash = (0, generateLink_1.random)(10);
        yield db_1.linkModel.create({
            userId: req.userId,
            hash: hash
        });
        res.json({
            hash
        });
    }
    else {
        yield db_1.linkModel.deleteOne({
            userId: req.userId
        });
        res.json({
            message: "Removed link"
        });
    }
}));
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    const link = yield db_1.linkModel.findOne({
        hash
    });
    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect input"
        });
        return;
    }
    const content = yield db_1.contentModel.find({
        userId: link.userId
    });
    const user = yield db_1.userModel.findOne({
        _id: link.userId
    });
    if (!user) {
        res.status(411).json({
            message: "user not found, error should ideally not happen"
        });
        return;
    }
    res.json({
        username: user.username,
        content: content
    });
}));
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
