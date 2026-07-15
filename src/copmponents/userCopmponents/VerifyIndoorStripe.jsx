import React, { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useVerifyIndoorBillMutation } from "../../store/services/userApi";
import { toast } from "react-toastify";

const VerifyIndoorStripe = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const success = searchParams.get("success");
  const appointmentId = searchParams.get("appointmentId");

  const [verifyIndoorBill, { isLoading, isError }] =
    useVerifyIndoorBillMutation();

  const hasCalled = useRef(false);

  useEffect(() => {
    const handlePaymentVerification = async () => {
      if (hasCalled.current) return;
      hasCalled.current = true;

      if (success === "true" && appointmentId) {
        try {
          const res = await verifyIndoorBill({
            appointmentId,
            success: true,
          }).unwrap();

          if (res.success) {
            toast.success(res.message || "Payment Verified Successfully!");
            navigate("/my-appointments");
          }
        } catch (err) {
          toast.error(
            err?.data?.message || "Stripe verification failed on server.",
          );
          navigate("/my-appointments");
        }
      } else {
        toast.error("Payment cancelled or failed.");
        navigate("/my-appointments");
      }
    };

    handlePaymentVerification();
  }, [success, appointmentId, verifyIndoorBill, navigate]);

  return (
    <div className="flex flex-col justify-center items-center min-h-[60vh] px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg border max-w-md w-full text-center space-y-6">
        {isLoading && (
          <>
            <div className="animate-spin border-4 border-indigo-600 border-t-transparent rounded-full w-14 h-14 mx-auto"></div>
            <h2 className="text-xl font-bold text-slate-800">
              Verifying Your Payment
            </h2>
            <p className="text-sm text-slate-500">
              Please do not refresh the page or close the window. We are
              securing your transaction with Stripe...
            </p>
          </>
        )}

        {isError && (
          <>
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600 text-2xl font-bold">
              &times;
            </div>
            <h2 className="text-xl font-bold text-red-600">
              Verification Failed
            </h2>
            <p className="text-sm text-slate-500">
              Something went wrong while communicating with the payment server.
              Redirecting you back...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyIndoorStripe;
