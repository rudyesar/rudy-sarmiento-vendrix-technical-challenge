/**
 * ! !!!!!!! ATTENTION !!!!!!!!
 *
 * TODO: Adjust the configuration below
 *
 * ! !!!!!!!!!!!!!!!!!!!!!!!!!!
 */

/**
 * @docs    https://nextjs.org/docs/api-reference/next.config.js/rewrites
 */
module.exports = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { "key": "Access-Control-Allow-Origin", "value": "*" },
          { "key": 'Access-Control-Allow-Methods', "value": '*' }

        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ];
  }
};
