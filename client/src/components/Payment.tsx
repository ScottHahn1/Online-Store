import { useMutation } from "@tanstack/react-query";
import { postData } from "../utils/Api";
import { useEffect, useState } from "react";
import { useUserContext } from "../contexts/UserContext";
import PaystackPop from "@paystack/inline-js";
import useVerifyPayment from "../hooks/useVerifyPayment";

interface PostVariables {
  url: string;
  body: {
    email: string;
    amount: number;
  };
}

interface Props {
  email: string;
  amount: number;
}

const Payment = ({ email, amount }: Props) => {
  const { accessToken } = useUserContext();
  const [paymentData, setPaymentData] = useState<{
    accessCode: string | null;
    reference: string | null;
  }>({ accessCode: null, reference: null });

  const { mutate } = useMutation({
    mutationFn: (variables: PostVariables) => postData(variables, accessToken),
    onSuccess: (res) => {
      setPaymentData({
        accessCode: res.data.access_code,
        reference: res.data.reference,
      });
    },
  });

  useEffect(() => {
    if (!email || !amount) return;

    mutate({
      url: "/api/payments/initialize",
      body: {
        email,
        amount: amount * 100,
      },
    });
  }, [email, amount, mutate]);

  useEffect(() => {
    if (!paymentData.accessCode) return;

    const popup = new PaystackPop();
    popup.resumeTransaction(paymentData.accessCode);
  }, [paymentData.accessCode]);

  const { data, isLoading } = useVerifyPayment(paymentData.reference);

  return (
    <div>
      {isLoading && <p>Verifying payment…</p>}

      {data?.data?.status === "failed" && (
        <p>Payment failed. Please try again.</p>
      )}

      {data?.data?.status === "success" && (
        <div style={{ textAlign: "center" }}>
          <h3>✅ Payment successful</h3>
          <p>Your transaction has been confirmed.</p>
        </div>
      )}
    </div>
  );
};

export default Payment;