import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const MyOrders = () => {
  const [myOrder, setMyOrder] = useState([]);
  const { currency, user, axios } = useAppContext();

  const fetchMyOrder = async () => {
    try {
      const { data } = await axios.get("/api/order/user");
      if (data.success) {
        setMyOrder(data.order);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyOrder();
    }
  }, [user]);
  return (
    <div className="mt-16 pb-16">
      <div className="flex flex-col items-end w-max mb-8">
        <p className="text-2xl font-medium uppercase">My Orders</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>
      {myOrder.map((order, idx) => (
        <div
          key={idx}
          className="border border-gray-200 rounded-lg mb-10 p-6 max-w-4xl mx-auto bg-white"
        >
          {/* Order Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center text-sm text-gray-600 gap-2 mb-6 border-b border-gray-300 pb-4">
            <p>
              <span className="font-semibold text-gray-700">Order ID:</span>{" "}
              {order._id}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Payment:</span>{" "}
              {order.paymentType}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Total:</span>{" "}
              {currency}
              {order.amount}
            </p>
          </div>

          {/* Order Items */}
          <div className="space-y-6">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-dashed border-gray-200 pb-4 last:border-none"
              >
                {/* Product Info */}
                <div className="flex gap-4 w-full sm:w-2/3">
                  <div className="bg-gray-100 p-2 rounded-md shrink-0">
                    <img
                      className="w-16 h-16 object-cover rounded-md"
                      src={item.product.image[0]}
                      alt={item.product.name}
                    />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-base font-semibold text-gray-800">
                      {item.product.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Category: {item.product.category}
                    </p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity || 1}
                    </p>
                  </div>
                </div>

                {/* Right Info */}
                <div className="text-sm space-y-1 text-left sm:text-right w-full sm:w-1/3">
                  <p className="text-gray-500">
                    Date:{" "}
                    <span className="text-gray-700 font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="text-gray-500">
                    Status:{" "}
                    <span className="text-yellow-600 font-semibold">
                      {order.status || "Pending"}
                    </span>
                  </p>
                  <p className="text-primary-dull font-bold text-base">
                    ₹{item.product.offerPrice * item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
