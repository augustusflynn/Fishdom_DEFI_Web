import Moralis from "moralis";

/**
 *
 * @param {tableName}: table name
 * @param {limit}: limit
 * @param {skip}: offset
 * @param {order: {key: 'desc', value: "createdAt" }}: order by
 * @returns {queryBuilder}: promise
 */

// cơ bản query cần có ....
function makeQueryBuilder(tableName, limit, skip, order) {
  const Object = Moralis.Object.extend(tableName);
  let queryBuilder = new Moralis.Query(Object);

  if (limit) {
    queryBuilder.limit(limit);
  }

  if (skip) {
    queryBuilder.skip(skip);
  }

  if (order && order.key !== "" && order.value !== "") {
    if (order.key === "desc") {
      queryBuilder.descending(order.value);
    } else {
      queryBuilder.ascending(order.value);
    }
  } else {
    queryBuilder.descending("createdAt");
  }

  return queryBuilder;
}

// đếm toàn bộ row có trong table để chia trang
/**
 *
 * @param {tableName}: table name
 * @return {number}: count all rows
 */
async function count(tableName) {
  if (!tableName) return;
  let query = makeQueryBuilder(tableName);
  return await query.count();
}

/**
 *
 * @param {tableName}: table name
 * @return {array data}: data
 */
async function find(tableName, limit, skip, order) {
  if (!tableName) return;
  let query = makeQueryBuilder(tableName, limit, skip, order);
  return await query.find();
}
async function subscription(tableName) {
  let query = new Moralis.Query(tableName);
  let sub = await query.subscribe();
  return sub;
}

async function dashboardFind(tableName, limit, skip) {
  if (!tableName) return;
  let query = makeQueryBuilder(tableName, limit, skip);
  query.equalTo("isHidden", false);
  return await query.find();
}
export { makeQueryBuilder, count, find, subscription, dashboardFind };
