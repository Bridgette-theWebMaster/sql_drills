 require('dotenv').config()
 const knex = require('knex')

 const knexInstance= knex({
     client: 'pg',
     connection: process.env.DB_URL
 })

function searchByName(searchTerm) {
    knexInstance
        .select('*')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
}

function paginatedItems(page) {
    const itemsPerPage = 6
    const offset = itemsPerPage * (page - 1)
    knexInstance
        .select('*')
        .from('shopping_list')
        .limit(itemsPerPage)
        .offset(offset)
}

function itemsAddedDaysAgo(daysAgo) {
    knexInstance
        .select('id', 'name', 'price', 'date_added', 'checked', 'category')
        .from('shopping_list')
        .where('date_added', '>', knexInstance.raw(`now() - '?? days':: INTERVAL`, daysAgo)
        )
}

function totalCost() {
    knexInstance
        .select('catergory')
        .sum('price as total')
        .from('shopping_list')
        .groupBy('category')

}