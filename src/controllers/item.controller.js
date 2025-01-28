import express from 'express';
import { validateAddItem, validateDeleteItem, validateGetItemById, validateGetItems, validateUpdateItem } from '../middlewares/item.validation.js';
import authenticateToken from '../middlewares/auth.js';
import itemService from '../services/item.services.js';

const itemRouter = express.Router();


itemRouter.post('/', authenticateToken, validateAddItem, async (req, res) => {
    try {
        const item = req.body;
        const newItem = await itemService.addItem(item);
        res.status(201).json({ success: true, message: 'Item added successfully', item: newItem });
    } catch (error) {
        if (error.code) {
            return res.status(error.code).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

itemRouter.get('/', authenticateToken, validateGetItems, async (req, res) => {
    try {
        const items = await itemService.getItems(req.query);
        res.status(200).json({ success: true, message: 'Items retrieved successfully', items });
    } catch (error) {
        if (error.code) {
            return res.status(error.code).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

itemRouter.get('/:id', authenticateToken, validateGetItemById, async (req, res) => {
    try {
        const itemId = req.params.id;
        const item = await itemService.getItemById(itemId);
        res.status(200).json({ success: true, message: 'Item retrieved successfully', item });
    } catch (error) {
        if (error.code) {
            return res.status(error.code).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}) 

itemRouter.put('/:id', authenticateToken, validateUpdateItem, async (req, res) => {
    try {
        const itemId = req.params.id;
        const updateData = req.body;
        const updatedItem = await itemService.updateItem(itemId, updateData);
        res.status(200).json({ success: true, message: 'Item updated successfully', item: updatedItem });
    } catch (error) {
        if (error.code) {
            return res.status(error.code).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

itemRouter.delete('/:id', authenticateToken, validateDeleteItem, async (req, res) => {
    try {
        const itemId = req.params.id;
        const result = await itemService.deleteItem(itemId);
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        if (error.code) {
            return res.status(error.code).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

export default itemRouter;