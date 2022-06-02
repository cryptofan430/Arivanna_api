const db = require("../../src/lib/database/query")

// const user_titles_one = []

// const user_statuses = []

// const user_access_levels_one = []

// const vendor_statuses_one = []

// const product_categories_one = []

// const order_statuses_one = []

// const order_shipping_statuses_one = []

//SEED 1
const user_one = {
  user_first_name: "luke",
  user_last_name: "shaw",
  user_email: "lukeshaw@mail.com",
  user_password: "passME",
  id_user_title: 1, //hard-coded
  id_user_status: 1,
  // id_user_access_level: 0,
}

//start-------------------------------------------------------------------------------------------
const get_user_one_id = async () => {
  const result = await db.search_one("users", "user_email", user_one.user_email)
  return result[0].id_user
}
//end-------------------------------------------------------------------------------------------

//SEED 2
const vendor_one = {
  business_name: "Cisco",
  vendor_phone_number: 54321,
  vendor_address: "plot 1, Cisco lane, Florida",
  vendor_short_desc: "Best PC money can get",
  id_vendor_status: 1, //hard coded
}

//start-------------------------------------------------------------------------------------------
const get_vendor_one_id = async () => {
  const result = await db.search_one("vendors", "business_name", vendor_one.business_name)
  return result[0].id_vendor
}
//end-------------------------------------------------------------------------------------------

// SEED 3
const product_one = {
  id_category: 1,
  product_title: "Alienware XP",
  product_desc: "Best gaming PC",
  id_product_thumbnail: 2,
}

//start-------------------------------------------------------------------------------------------
const get_product_one_id = async () => {
  const result = await db.search_one("products", "product_title", product_one.product_title)
  return result[0].id_product
}
//end-------------------------------------------------------------------------------------------

// SEED 4
const productOne_m2m_vendorOne = {
  p2v_price: 1500,
  inventory: "XP5 Limited edition",
}

//start-------------------------------------------------------------------------------------------
const get_productOne_m2m_vendorOne_id = async () => {
  const result = await db.search_one(
    "products_m2m_vendors",
    "inventory",
    productOne_m2m_vendorOne.inventory
  )
  return result[0].id_product_m2m_vendor
}
//end-------------------------------------------------------------------------------------------

//start-------------------------------------------------------------------------------------------
const get_orderOne_m2m_productOne_id = async () => {
  const id_product_m2m_vendor = await get_productOne_m2m_vendorOne_id()

  const result = await db.search_one(
    "orders_m2m_products",
    "id_product_m2m_vendor",
    id_product_m2m_vendor
  )
  return result[0].id_order_m2m_product
}
//end-------------------------------------------------------------------------------------------

// SEED 5
const order_one = {
  id_order_status: 1, //hard coded
  total: 1500,
  paymentMethod: "spendrPay",
  isPaid: 1,
}

//start-------------------------------------------------------------------------------------------
const get_order_one_id = async () => {
  const result = await db.search_one("orders", "paymentMethod", order_one.paymentMethod)
  return result[0].id_order
}
//end-------------------------------------------------------------------------------------------

// SEED 6
const order_shipping_one = {
  id_order_shipping_status: 1, //hard coded
  os_company: "Larnka delivery",
  os_tracking_number: "123BAA8L",
}

//start-------------------------------------------------------------------------------------------
const get_order_shipping_one_id = async () => {
  const result = await db.search_one("order_shippings", "os_company", order_shipping_one.os_company)
  return result.id_order_shipping
}

const id_order_shipping_one = get_order_shipping_one_id()
//end-------------------------------------------------------------------------------------------
let id_user
let id_vendor
let id_product
let id_product_m2m_vendor
let id_order
let id_order_m2m_product

async function setupDatabase() {
  await db.insert_new(user_one, "users")
  id_user = await get_user_one_id()
  await db.insert_new(vendor_one, "vendors")
  id_vendor = await get_vendor_one_id()
  await db.insert_new(product_one, "products")
  id_product = await get_product_one_id()
  await db.insert_new(
    {
      ...productOne_m2m_vendorOne,
      id_vendor,
      id_product,
    },
    "products_m2m_vendors"
  )
  id_product_m2m_vendor = await get_productOne_m2m_vendorOne_id()
  await db.insert_new({ id_product_m2m_vendor }, "orders_m2m_products")
  id_order_m2m_product = await get_orderOne_m2m_productOne_id()
  await db.insert_new({ ...order_one, id_user, id_order_m2m_product }, "orders")
  id_order = await get_order_one_id()
  //   await db.insert_new(order_shipping_one, "order_shippings")
}

async function teardownDatabase() {
  await db.delete_one("orders", "id_order_m2m_product", id_order_m2m_product)
  await db.delete_one("orders_m2m_products", "id_order_m2m_product", id_order_m2m_product)
  await db.delete_one("products_m2m_vendors", "id_product_m2m_vendor", id_product_m2m_vendor)
  await db.delete_one("vendors", "id_vendor", id_vendor)
  await db.delete_one("products", "id_product", id_product)
  await db.delete_one("users", "id_user", id_user)
  // await db.delete_one("order_shippings", "id_order_shipping_one", id_order_shipping_one)
}

//For test
// setupDatabase()
//   .then(() => console.log("setup completed"))
//   .then(() => teardownDatabase())
//   .then(() => console.log("teardown completed"))
//   .then(() => process.exit())

module.exports = {
  setupDatabase,
  teardownDatabase,
}
