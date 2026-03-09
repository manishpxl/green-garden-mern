const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
const Plant = require('../models/plant');
const mongoose = require('mongoose');

const addOrder = async (req, res) => {
    try {
        console.log("Order submission request received:", req.body);
        const { orderItems, user, shippingAddress, billingAddress } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: "Order must contain at least one item." });
        }

        let newOrder = new Order({
            user: new mongoose.Types.ObjectId(user),
            orderItems: [],
            totalAmount: 0,
            orderStatus: "Pending",
            shippingAddress,
            billingAddress
        });

        newOrder = await newOrder.save();

        let calculatedTotal = 0;
        const savedOrderItemIds = [];

        for (const item of orderItems) {
            const plant = await Plant.findById(item.plant);
            if (!plant) {
                return res.status(404).json({ message: `Plant with ID ${item.plant} not found.` });
            }

            if (plant.stockQuantity < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for plant ${plant.plantName}.` });
            }

            // Deduct stock
            plant.stockQuantity -= item.quantity;
            await plant.save();

            const orderItem = new OrderItem({
                quantity: item.quantity,
                price: plant.price,
                plant: plant._id,
                order: newOrder._id
            });
            const savedItem = await orderItem.save();

            savedOrderItemIds.push(savedItem._id);
            calculatedTotal += (plant.price * item.quantity);
        }

        newOrder.orderItems = savedOrderItemIds;
        newOrder.totalAmount = calculatedTotal;

        await newOrder.save();

        res.status(201).json({ message: "Order successfully created", order: newOrder });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user')
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'plant'
                }
            });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user')
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'plant'
                }
            });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrdersByUserId = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId })
            .populate('user')
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'plant'
                }
            });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this user" });
        }
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrder = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ message: "Successfully updated order", order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ message: "Successfully deleted order", order: deletedOrder });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addOrder,
    getAllOrders,
    getOrderById,
    getOrdersByUserId,
    updateOrder,
    deleteOrder
};
