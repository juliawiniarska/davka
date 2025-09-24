/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://davkacafe.pl',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'weekly',
  priority: 0.7,
  additionalPaths: async (config) => [
    await config.transform(config, '/'),
    await config.transform(config, '/menu'),
    await config.transform(config, '/daily'),
    await config.transform(config, '/about'),
    await config.transform(config, '/contact'),
  ],
}
