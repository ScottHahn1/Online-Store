import { Router } from "express";
import axios from "axios";
import crypto from "crypto";
import pool from "../database";
import { RowDataPacket } from "mysql2";

const paymentsRouter = Router();

paymentsRouter.post("/initialize", async (req, res) => {
    try {
        const { userId, email, amount } = req.body;

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
                    Authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        )

        const accessCode = response.data.data.access_code;
        const reference = response.data.data.reference;

        pool.query(
            `INSERT INTO payments (user_id, reference, access_code, amount, currency, status)
            VALUES (?, ?, ?, ?, ?, 'pending')`,
            [userId, reference, accessCode, amount, 'ZAR']
        )

        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Payment initialization failed" });
    }
})

interface PaymentRow extends RowDataPacket {
    status: string;
}

paymentsRouter.get("/verify/:reference", async (req, res) => {
    const { reference } = req.params;
    
    try {
        const [rows] = await pool.promise().query<PaymentRow[]>(
            "SELECT status FROM payments WHERE reference = ?", 
            [reference]
        );

        if (!rows.length) return res.json({ status: "pending" });

        res.status(200).json({ status: rows[0].status });
    } catch (error) {
        res.status(500).json({ message: "Payment verification failed" });
    }
})

paymentsRouter.post("/webhook", (req, res) => {
    try {
        const hash = crypto.createHmac(
            'sha512', process.env.PAYSTACK_KEY as string
        )
        .update(JSON.stringify(req.body))
        .digest('hex');

        if (hash == req.headers['x-paystack-signature']) {
            const event = req.body;
            console.log('Paystack webhook received:', event);

            if (event.event === 'charge.success') {
                const reference = event.data.reference;
                // TODO: mark transaction as paid in your database
                console.log(`Payment successful for reference: ${reference}`);
            }
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error');
    }
})

export default paymentsRouter;