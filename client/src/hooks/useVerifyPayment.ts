import { useQuery } from "@tanstack/react-query";
import { getData } from "../utils/Api";

interface VerifyPayment {
    data: {
        status: string;
    }
}

const useVerifyPayment = (reference: string | null) => {
  return useQuery({
    queryKey: ["verifyPayment", reference],
    queryFn: () => getData<VerifyPayment, {}>(`/api/payments/verify/${reference}`),
    enabled: !!reference,
    retry: false,
    refetchInterval: (query) => {
        const status = query?.state?.data?.data?.status;
        return status === "success" || status === "failed" ? false : 3000;
    },
    refetchIntervalInBackground: true,
  });
};

export default useVerifyPayment;