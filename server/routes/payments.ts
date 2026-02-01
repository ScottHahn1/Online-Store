import { Router } from "express";
import axios from "axios";

const paymentsRouter = Router();

paymentsRouter.post("/initialize", async (req, res) => {
    try {
        const { email, amount } = req.body;

        if (!email || !amount) {
            return res.status(400).json({ message: "Email and amount are required" });
        }

        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize", 
            {
                email: email,
                amount: amount
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        )

        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Payment initialization failed" });
    }
})

export default paymentsRouter;