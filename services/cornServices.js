const cron = require('node-cron');
const RSSService = require('./alertservices');
const { feeds } = require('../config/feeds');

class CronService {
    constructor() {
        // Create a new instance of RSSService
        this.rssService = new RSSService();
    }

    init() {
        // Run every hour
        cron.schedule('0 * * * *', () => {
            console.log('Running scheduled feed updates...');
            this.fetchAllFeeds();
        });

        // Run immediately on startup
        this.fetchAllFeeds();
    }

    async fetchAllFeeds() {
        try {
            for (const feed of feeds) {
                await this.rssService.fetchAndStoreAlerts(feed.url, feed.category);
            }
            console.log('All feeds updated successfully');
        } catch (error) {
            console.error('Error updating feeds:', error);
        }
    }
}

module.exports = new CronService();