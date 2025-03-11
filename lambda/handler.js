module.exports.sendNotification = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");

    if (!body.orderId || !body.total || !body.products) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Order data are not complete" }),
      };
    }

    console.log(
      `📢 Notification: New order was created! ID: ${body.orderId}, Total: R$${body.total}`
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Notification sent successfully!",
      }),
    };
  } catch (error) {
    console.error("Error to process the notification", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
