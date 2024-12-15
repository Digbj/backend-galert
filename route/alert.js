const express = require('express');
const router = express.Router();
const Alert = require('../models/alert');

// Get alerts with advanced filtering
router.get('/', async (req, res) => {
    try {
        const {
            category,
            source,
            startDate,
            endDate,
            search,
            sortBy = 'pubDate',
            sortOrder = 'desc',
            page = 1,
            limit = 10
        } = req.query;

        // Build query
        const query = {};

        // Category filter
        if (category) {
            query.category = category;
        }

        // Source filter
        if (source) {
            query.source = source;
        }

        // Date range filter
        if (startDate || endDate) {
            query.pubDate = {};
            if (startDate) query.pubDate.$gte = new Date(startDate);
            if (endDate) query.pubDate.$lte = new Date(endDate);
        }

        // Text search
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Execute query with sorting and pagination
        const alerts = await Alert.find(query)
            .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const total = await Alert.countDocuments(query);

        res.json({
            alerts,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get available categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Alert.distinct('category');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get available sources
router.get('/sources', async (req, res) => {
    try {
        const sources = await Alert.distinct('source');
        res.json(sources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;