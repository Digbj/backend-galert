const Parser = require('rss-parser');
const Alert = require('../models/alert');
const parser = new Parser();

class RSSService {
    async fetchAndStoreAlerts(feedUrl, category) {
        try {
            // console.log(`Fetching alerts for category: ${category}`);
            const feed = await parser.parseURL(feedUrl);
            const alerts = [];

            for (const item of feed.items) {
                // Check if alert already exists
                const existingAlert = await Alert.findOne({ link: item.link });
                if (!existingAlert) {
                    const alert = new Alert({
                        title: item.title,
                        link: item.link,
                        description: item.contentSnippet || item.content || '',
                        category: category,
                        pubDate: item.pubDate || new Date(),
                        source: item.source?.name || feed.title || 'Unknown'
                    });
                    await alert.save();
                    alerts.push(alert);
                }
            }

            console.log(`Stored ${alerts.length} new alerts for ${category}`);
            return alerts;
        } catch (error) {
            console.error('Error fetching RSS feed:', error);
            throw error;
        }
    }
}

// Export the class instead of an instance
module.exports = RSSService;