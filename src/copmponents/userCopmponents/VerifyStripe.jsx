import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useVerifyStripeMutation } from "../../store/services/userApi";   

const VerifyStripe = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasCalled = useRef(false); // یہ سٹرکٹ موڈ میں ڈبل کال ہونے سے بچائے گا

  const success = searchParams.get("success");
  const appointmentId = searchParams.get("appointmentId");

  const [verifyStripe] = useVerifyStripeMutation();

  useEffect(() => {
    const checkPayment = async () => {
      if (hasCalled.current) return;
      hasCalled.current = true;

      if (success === "true" && appointmentId) {
        try {
           await verifyStripe({ appointmentId, success }).unwrap();
          
          toast.success(" Payment Verified & Appointment Confirmed!");
          navigate("/my-appointments");  
        } catch (error) {
          toast.error(error?.data?.message || "Payment verification failed.");
          navigate("/");
        }
      } else {
        toast.error("Payment cancelled or invalid session.");
        navigate("/");
      }
    };

    checkPayment();
  }, [success, appointmentId, navigate, verifyStripe]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-slate-50">
      <div className="text-center space-y-4">
         <div className="animate-spin text-4xl inline-block border-4 border-primary border-t-transparent rounded-full w-12 h-12"></div>
        <h2 className="text-xl font-bold text-slate-800">Verifying your payment...</h2>
        <p className="text-sm text-slate-500">Please do not refresh or close this page.</p>
      </div>
    </div>
  );
};

export default VerifyStripe;