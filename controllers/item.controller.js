import express from 'express';
import { validateAddItem, validateGetItemById, validateUpdateItem } from '../middlewares/item.validation';
import authenticateToken from '../middlewares/auth';
import itemService from '../services/item.services';

const itemRouter = express.Router();


itemRouter.post('/', authenticateToken, validateAddItem, async (req, res) => {
    try {
        const item = req.body;
        const userId = req.user._id;
        const newItem = await itemService.addItem(item, userId);
        res.status(201).json({ success: true, message: 'Item added successfully', item: newItem });
    } catch (error) {
        if (error.code) {
            return res.status(error.code).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

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

itemRouter.put(':/id', authenticateToken, validateUpdateItem, async (req, res) => {
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

itemRouter.delete(':/id', authenticateToken, async (req, res) => {
    try {
        const itemId = req.params.id;
        await itemService.deleteItem(itemId);
        res.status(200).json({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
        if (error.code) {
            return res.status(error.code).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

export default itemRouter;