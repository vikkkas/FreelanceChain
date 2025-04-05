import { PrismaClient } from "@prisma/client";
import {Router} from "express";
import jwt from "jsonwebtoken";
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { authMiddleware } from "../middleware";
import { createTaskInput } from "../types";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import dotenv from "dotenv";
dotenv.config();

const DEFAULT_TITLE = "Select the most clickable thumbnail";
const JWT_SECRET = process.env.JWT_SECRET;
const AWS_ID = process.env.AWS_ID;
const TOTAL_DECIMALS = process.env.TOTAL_DECIMALS;
const AWS_SECRET = process.env.AWS_SECRET;
const router = Router();
const prismaClient = new PrismaClient();
prismaClient.$transaction(
    async (prisma) => {
      // Code running in a transaction...
    },
    {
      maxWait: 5000, // default: 2000
      timeout: 10000, // default: 5000
    }
)

//@ts-ignore
const s3Client = new S3Client({
    credentials: {
        accessKeyId: AWS_ID,
        secretAccessKey: AWS_SECRET
    },
    region: "eu-north-1",
    endpoint: "https://s3.eu-north-1.amazonaws.com"
})

//@ts-ignore
router.get("/task", authMiddleware, async (req, res) => {
    // @ts-ignore
    const taskId: string = req.query.taskId;
    // @ts-ignore
    const userId: string = req.userId;

    const taskDetails = await prismaClient.task.findFirst({
        where: {
            user_id: Number(userId),
            id: Number(taskId)
        },
        include: {
            options: true
        }
    })

    if (!taskDetails) {
        return res.status(411).json({
            message: "You dont have access to this task"
        })
    }
    const responses = await prismaClient.submission.findMany({
        where: {
            task_id: Number(taskId)
        },
        include: {
            option: true
        }
    });

    const result: Record<string, {
        count: number;
        option: {
            imageUrl: string
        }
    }> = {};

    taskDetails.options.forEach(option => {
        result[option.id] = {
            count: 0,
            option: {
                imageUrl: option.image_url
            }
        }
    })

    responses.forEach(r => {
        result[r.option_id].count++;
    });

    res.json({
        result,
        taskDetails
    })

})

    //@ts-ignore
router.post("/task", authMiddleware, async (req, res) => {
    //@ts-ignore
    const userId = req.userId
    // validate the inputs from the user;
    const body = req.body;
    const parseData = createTaskInput.safeParse(body);
    const user = await prismaClient.user.findFirst({
        where: {
            id: userId
        }
    })
    parseData.success = true;
    if (!parseData.success) {
        return res.status(411).json({
            message: "You've sent the wrong inputs"
        })
    }
    // const transaction = await connection.getTransaction(parseData.data.signature, {
    //     maxSupportedTransactionVersion: 1
    // });


    // if ((transaction?.meta?.postBalances[1] ?? 0) - (transaction?.meta?.preBalances[1] ?? 0) !== 100000000) {
    //     return res.status(411).json({
    //         message: "Transaction signature/amount incorrect"
    //     })
    // }
    // //@ts-ignore
    // if (transaction?.transaction.message.getAccountKeys().get(1)?.toString() !== PARENT_WALLET_ADDRESS) {
    //     return res.status(411).json({
    //         message: "Transaction sent to wrong address"
    //     })
    // }

    // if (transaction?.transaction.message.getAccountKeys().get(0)?.toString() !== user?.address) {
    //     return res.status(411).json({
    //         message: "Transaction sent to wrong address"
    //     })
    // }
    // // was this money paid by this user address or a different address?

    // // parse the signature here to ensure the person has paid 0.1 SOL
    // // const transaction = Transaction.from(parseData.data.signature);

    try {
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
    
        // const existingTask = await prismaClient.task.findFirst({
        //     where: { signature: parseData.data.signature }
        // });
        // if (existingTask) {
        //     return res.status(400).json({ message: "Signature already exists" });
        // }
    
        let response = await prismaClient.$transaction(async tx => {
            const response = await tx.task.create({
                data: {
                    title: parseData.data.title ?? DEFAULT_TITLE,
                    amount: 1000000 ,
                    signature: parseData.data.signature,
                    // @ts-ignore
                    user_id: user.id,
                }
            });
        
            await tx.option.createMany({
                data: parseData.data.options.map(x => ({
                    image_url: x.imageUrl,
                    task_id: response.id
                }))
            });
    
            return response;
        });
    
        res.json({ id: response.id });
    } catch (e) {
        // console.log(e);
        return res.status(411).json({
            message: "Transaction signature/amount incorrect"
        });
    }

})

// @ts-ignore
router.get("/presignedUrl", authMiddleware, async (req, res) => {
    // @ts-ignore
    const userId = req.userId;
    // @ts-ignore
    const { url, fields } = await createPresignedPost(s3Client, {
        Bucket: "freelancechain",
        Key: `/fiver/${userId}/${Math.random()}/image.jpg`,
        Conditions: [
          ['content-length-range', 0, 5 * 1024 * 1024] // 5 MB max
        ],
        Expires: 3600
    })

    res.json({
        preSignedUrl: url,
        fields
    })
    
})
// @ts-ignore
router.get("/taskList", authMiddleware, async (req,res)=>{
    // @ts-ignore
    const userId = req.userId;
    const tasks = await prismaClient.task.findMany({
        where: {
            user_id: userId
        }
    })
    res.json(tasks);
})
// sign with wallet
// @ts-ignore
router.post("/signin", async(req, res) => {
    //TODO : implement sign in verification logic here
    const { publicKey, signature } = req.body;
    const message = new TextEncoder().encode("Sign into mechanical turks");

    const result = nacl.sign.detached.verify(
        message,
        new Uint8Array(signature?.data),
        new PublicKey(publicKey).toBytes(),
    );


    if (!result) {
        return res.status(411).json({
            message: "Incorrect signature"
        })
    }

    const existingUser = await prismaClient.user.findFirst({
        where: {
            address: publicKey
        }
    })
    if (existingUser) {
    const token = jwt.sign({
        userId: existingUser.id,
        //@ts-ignore
    },JWT_SECRET);
    res.json({token});
}
    else{
        const user = await prismaClient.user.create({
            data: {
                address: publicKey
            }
        })
        const token = jwt.sign({
            userId: user.id,
            // @ts-ignore
        },JWT_SECRET);

        res.json({token});
    }
});

export default router;