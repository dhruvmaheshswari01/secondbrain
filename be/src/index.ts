import express from "express";
import { userModel,contentModel,linkModel } from "./db";
import z from "zod";
import bcrypt from 'bcrypt';
import { ZodError } from "zod";
import jwt from "jsonwebtoken";
import { userMiddleware } from "./middleware";
import { random } from "./generateLink";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
app.use(express.json());
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

const signupSchema = z.object({
    username:z.string().min(3,{message:"Username must be atleast 3 characters long."}),
    password:z.string().min(8,{message:"Password must be atleast 8 characters long."})
});
interface UserDocument {
    username: string;
    password: string;
    _id: string;
};

app.post("/api/v1/signup",async(req,res)=>{
    try{
        const {username,password}=signupSchema.parse(req.body);
        const hashedPassword = await bcrypt.hash(password,10);

        await userModel.create({
            username:username,
            password:hashedPassword
        });
        res.status(201).json({
            message:"User Signed In"
        });
    }catch(error){
        if (error instanceof ZodError) {
            res.status(400).json({
                message: "Validation error.",
                errors: error.errors, 
            });
        } else if ((error as any).code === 11000) {
            res.status(409).json({
                message: "User already exists.",
            });
        } else {
            res.status(500).json({
                message: "Internal server error.",
            });
        }
    }
});

app.post("/api/v1/signin", async (req, res) => {
    try{
        const {username,password}=signupSchema.parse(req.body);
        const user = (await userModel.findOne({ username })) as UserDocument | null;
        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if(isPasswordValid){
                const token = jwt.sign({
                    id: user._id
                }, JWT_SECRET)
        
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
        else{
            res.status(403).json({
                message: "Incorrrect credentials"
            });
        }
    }catch(error){
        if (error instanceof z.ZodError) {
            res.status(400).json({
                message: "Validation error.",
                errors: error.errors,
            });
        } else {
            res.status(500).json({
                message: "Internal server error.",
            });
        }
    }
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
    await contentModel.create({
        link:req.body.link,
        type:req.body.type,
        title: req.body.title,
        userId: req.userId
    })

    res.json({
        message: "Content added"
    })
    
});

app.get("/api/v1/content", userMiddleware, async (req, res) => {
    const userId = req.userId;
    const content = await contentModel.find({
        userId: userId
    }).populate("userId", "username")
    res.json({
        content
    })
});

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
    try {
        const contentId = req.body.contentId;
        await contentModel.deleteOne({
            _id: contentId,
            userId: req.userId,
        });
        res.status(200).json({
            message: "Content deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting content:", error);
        res.status(500).json({
            message: "Internal server error.",
        });
    }
});

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
    const share = req.body.share;
    if (share) {
            const existingLink = await linkModel.findOne({
                userId: req.userId
            });

            if (existingLink) {
                res.json({
                    hash: existingLink.hash
                });
                return;
            }
            const hash = random(10);
            await linkModel.create({
                userId: req.userId,
                hash: hash
            });

            res.json({
                hash
            });
    } else {
        await linkModel.deleteOne({
            userId: req.userId
        });

        res.json({
            message: "Removed link"
        });
    }
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;

    const link = await linkModel.findOne({
        hash
    });

    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect input"
        })
        return;
    }

    const content = await contentModel.find({
        userId: link.userId
    });

    const user = await userModel.findOne({
        _id: link.userId
    });

    if (!user) {
        res.status(411).json({
            message: "user not found, error should ideally not happen"
        })
        return;
    }

    res.json({
        username: user.username,
        content: content
    });

});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});