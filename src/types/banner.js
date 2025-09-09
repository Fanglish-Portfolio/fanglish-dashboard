/**
 * @typedef {Object} Banner
 * @property {string} _id
 * @property {string} imageUrl
 * @property {string} spaceKey
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {number} __v
 */

/**
 * @typedef {Object} ApiResponse
 * @template T
 * @property {boolean} success
 * @property {string} message
 * @property {T} data
 */

/**
 * @typedef {Object} CreateBannerRequest
 * @property {File} image
 */

/**
 * @typedef {Object} UpdateBannerRequest
 * @property {File} [image]
 */

export {};
