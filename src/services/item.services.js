import Item from "../models/item.js"

const addItem = async (item, userId) => {
    const existingItem = await Item.findOne({ name: item.name.trim() })

    if (existingItem) {
        const error = new Error('Item already exists')
        error.code = 409
        throw error
    }

    const newItem = new Item({ ...item})
    await newItem.save()
    return newItem
}

// filter items based on category, minPrice, maxPrice
// sort items by category, price, quantity, totalCost
const getItems = async (queryParams) => {
    const { category, minPrice, maxPrice, sortBy, sortOrder = 'asc' } = queryParams;
    const filter = {};
  
    if (category) filter.category = category;
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }
  
    const pipeline = [{ $match: filter }];
  
    if (sortBy) {
      if (sortBy === 'totalCost') {
        pipeline.push({ $addFields: { totalCost: { $multiply: ['$price', '$quantity'] } } });
        pipeline.push({ $sort: { totalCost: sortOrder === 'desc' ? -1 : 1 } });
      } else {
        pipeline.push({ $sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 } });
      }
    }
    
    const result = await Item.aggregate(pipeline)
    console.log(result)

    return {
        items: result.map(item => ({
            ...item,
            totalCost: item.price * item.quantity
        }))
    }
}

const getItemById = async (itemId) => {
    const item = await Item.findById(itemId)
    if (!item) {
        const error = new Error('Item not found')
        error.code = 404
        throw error
    }
    return {
        ...item._doc,
        totalCost: item.price * item.quantity
    }
}

const updateItem = async (itemId, updateData) => {

    if (updateData.name) {
        const existingItem = await Item.findOne({ name: updateData.name.trim() });
        if (existingItem && existingItem._id.toString() !== itemId) {
          const error = new Error("Item with this name already exists");
          error.code = 409;
          throw error;
        }
    }
    
    const updatedItem = await Item.findByIdAndUpdate(
        itemId,
        { ...updateData },
        { new: true, runValidators: true } 
    );
    
    if (!updatedItem) {
        const error = new Error("Item not found");
        error.code = 404;
        throw error;
    }

    return updatedItem
}

const deleteItem = async (itemId) => {
    const item = await Item.findById(itemId)
    if (!item) {
        const error = new Error('Item not found')
        error.code = 404
        throw error
    }
    await Item.deleteOne({ _id: itemId })
    return { message : 'Item deleted successfully' }
}

const getLowStockItems = async (lowStockNo) => {
    const items = await Item.find({ quantity: { $lt: lowStockNo } });
    return items;
}


export default { addItem, getItems, getItemById, updateItem, deleteItem, getLowStockItems }