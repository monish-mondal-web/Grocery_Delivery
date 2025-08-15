import Order from "../models/order.js";
import Product from "../models/product.js";
import scripe, { Stripe } from "stripe";
import User from "../models/user.js"

//place order cod: /api/order/cod
export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }
    //calculate amount
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);
    //add taxt 2%
    amount += Math.floor(amount * 0.02);
    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
    });
    return res.json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
// Place order stripe: /api/order/stripe
export const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    const origin = req.headers.origin;

    let productData = [];
    let amount = 0;

    if (!address || !items || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.json({ success: false, message: "Product not found" });
      }

      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });

      amount += product.offerPrice * item.quantity;
    }

    const taxAmount = Math.floor(amount * 0.02);
    amount += taxAmount;

    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
    });

    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = productData.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round((item.price + item.price * 0.02) * 100), // পয়সা তে convert
      },
      quantity: item.quantity,
    }));

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-order`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    return res.json({ success: true, url: session.url });
  } catch (error) {
    console.error("Stripe Order Error:", error);
    return res.json({ success: false, message: error.message });
  }
};

//strip webhook verification
export const stripeWebhooks = async (req, res) => {
  const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        const session = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });

        const { orderId, userId } = session.data[0].metadata;

        await Order.findByIdAndUpdate(orderId, { isPaid: true });
        await User.findByIdAndUpdate(userId, { cartItems: {} });

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;
        const failureReason = paymentIntent.last_payment_error?.message || "Unknown reason";

        const session = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });

        const { orderId } = session.data[0].metadata;

        await Order.findByIdAndUpdate(orderId, {
          status: "failed",
          failureMessage: failureReason,
        });

        // console.log(`Payment failed for order ${orderId}: ${failureReason}`);
        break;
      }

      default:
        // console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).send("Webhook received successfully");
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).send("Server error processing webhook");
  }
};

//get order by user id: /api/order/user
export const getUserOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const order = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.json({ success: true, order });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
//get all order: /api/order/seller
export const getAllOrder = async (req, res) => {
  try {
    const order = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.json({ success: true, order });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
