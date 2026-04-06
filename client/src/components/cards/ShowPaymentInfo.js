import React from "react";

const ShowPaymentInfo = ({ order, showStatus = true }) => {
  const paymentIntent = order?.paymentIntent || {};
  const amount = Number(paymentIntent.amount || 0) / 100;
  const currency = (paymentIntent.currency || "usd").toUpperCase();
  const method =
    paymentIntent.payment_method_types?.[0] ||
    paymentIntent.payment_method ||
    "N/A";
  const paymentStatus = paymentIntent.status || "N/A";
  const createdAt = paymentIntent.created
    ? new Date(
        paymentIntent.created > 9999999999
          ? paymentIntent.created
          : paymentIntent.created * 1000
      ).toLocaleDateString()
    : "N/A";

  return (
    <div>
      <p>
        <span>Order Id: {paymentIntent.id || "N/A"}</span>
        {" / "}
        <span>
          Amount:{" / "}
          {amount.toLocaleString("en-US", {
            style: "currency",
            currency,
          })}
        </span>
        {" / "}
        <span>Currency: {currency}</span>
        {" / "}
        <span>Method: {String(method).toUpperCase()}</span>
        {" / "}
        <span>Payment: {String(paymentStatus).toUpperCase()}</span>
        {" / "}
        <span>Orderd on: {createdAt}</span>
        <br />
        {showStatus && (
          <span className="badge bg-primary text-white">
            STATUS: {order?.orderStatus || "N/A"}
          </span>
        )}
      </p>
    </div>
  );
};

export default ShowPaymentInfo;
