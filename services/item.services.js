import Item from "../models/item"


const addItem = async (item, userId) => {
    const existingItem = await Item.findOne({ name: item.name.trim() })

    if (existingItem) {
        const error = new Error('Item already exists')
        error.code = 409
        throw error
    }

    const newItem = new Item({ ...item, addedBy: userId })
    await newItem.save()
    return {
        id: newItem._id,
        name: newItem.name,
        description: newItem.description,
        quantity: newItem.quantity,
        price: newItem.price,
        category: newItem.category,
        totalCost: newItem.quantity * newItem.price
    }
}

const getItemById = async (itemId) => {
    const item = await Item.findById(itemId)
    if (!item) {
        const error = new Error('Item not found')
        error.code = 404
        throw error
    }
    return item
}

const updateItem = async (itemId, updateData) => {
    const item = await Item.findById(itemId)
    if (!item) {
        const error = new Error('Item not found')
        error.code = 404
        throw error
    }

    const existingItem = await Item.findOne({ name: updateData.name.trim() })
    if (existingItem && existingItem._id.toString() !== itemId) {
        const error = new Error('Item already exists')
        error.code = 409
        throw error
    }

    Object.keys(updateData).forEach(key => {
        item[key] = updateData[key]
    })
    await item.save()
    return item
}



export default { addItem, getItemById, updateItem }