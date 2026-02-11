import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CheckoutForm = ({ cart, store, onClose }) => {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      console.log(store._id);
      

      if (paymentMethod === "cash") {
        // 💵 CASH LOGIC
        await axios.post(
          "http://localhost:5001/api/orderscreate",
          {
            shopId: store._id,
            customerName,
            customerEmail,
            paymentMethod
          },
          { withCredentials: true }
        );

        toast.success("Cash order completed");
        onClose(true);
      }

      if (paymentMethod === "upi") {
        // 💳 RAZORPAY INIT LOGIC
        const res = await axios.post(
          "http://localhost:5001/api/orderscreate",
          {
            shopId: store._id,
            customerName,
            customerEmail,
          },
          { withCredentials: true }
        );

        const { razorpayOrder } = res.data;

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY,
          amount: razorpayOrder.amount,
          currency: "INR",
          name: store.shopName,
          order_id: razorpayOrder.id,
          handler: async function (response) {
            await axios.post(
              "http://localhost:5001/api/orders/verify",
              {
                ...response,
              },
              { withCredentials: true }
            );

            toast.success("Payment successful");
            onClose(true);
          },
          prefill: {
            name: customerName,
            email: customerEmail,
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      toast.error("Checkout failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-bold">Customer Details</h2>

        <input
          type="text"
          placeholder="Customer Name (optional)"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="email"
          placeholder="Customer Email (optional)"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <div className="space-y-2">
          <label className="block font-semibold">Payment Method</label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Cash
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="upi"
              checked={paymentMethod === "upi"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            UPI (Razorpay)
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={() => onClose(false)}
            className="flex-1 border py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 rounded"
          >
            {loading ? "Processing..." : "Confirm Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
