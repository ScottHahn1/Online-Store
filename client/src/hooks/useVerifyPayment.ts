import { useQuery } from "@tanstack/react-query";
import { getData } from "../utils/Api";
import { useUserContext } from "../contexts/UserContext";

interface VerifyPayment {
    status: string;
}

const useVerifyPayment = (reference: string | null) => {
    const { user } = useUserContext();

    return useQuery({
        queryKey: ["verifyPayment", reference],
        queryFn: () => 
            getData<VerifyPayment, { userId: number }>(
                `/api/payments/verify/${reference}`, 
                { userId: user?.userId as number }
            ),
        enabled: !!reference,
        retry: false,
        refetchInterval: (query) => {
            const status = query?.state?.data?.status;
            return status === "success" || status === "failed" ? false : 3000;
        },
        refetchIntervalInBackground: true,
    });
};

export default useVerifyPayment;