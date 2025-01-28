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

const deleteItem = async (itemId) => {
    const item = await Item.findById(itemId)
    console.log(item)
    if (!item) {
        const error = new Error('Item not found')
        error.code = 404
        throw error
    }
    await Item.deleteOne({ _id: itemId })
    return { message : 'Item deleted successfully' }
}



export default { addItem, getItemById, updateItem, deleteItem }