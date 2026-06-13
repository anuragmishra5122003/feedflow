const { chromium } = require('playwright');

let browser = null;
let page = null;
let isRunning = false;

const hashtags = {
  'Artificial Intelligence': ['artificialintelligence', 'aitools', 'machinelearning', 'deeplearning', 'chatgpt'],
  'Technology': ['technology', 'tech', 'coding', 'programming', 'developer'],
  'Startups': ['startup', 'startups', 'entrepreneur', 'founder', 'startuplife'],
  'Business': ['business', 'businessowner', 'entrepreneurship', 'success', 'hustle'],
  'Finance': ['finance', 'investing', 'stockmarket', 'crypto', 'money'],
  'Fitness': ['fitness', 'gym', 'workout', 'fitnessmotivation', 'bodybuilding'],
  'Health': ['health', 'healthy', 'wellness', 'healthylifestyle', 'nutrition'],
  'Education': ['education', 'learning', 'student', 'knowledge', 'study'],
  'Travel': ['travel', 'travelphotography', 'wanderlust', 'adventure', 'explore'],
  'Gaming': ['gaming', 'gamer', 'videogames', 'pcgaming', 'gamingcommunity'],
};

async function startAutomation(username, password, preferences, status, addLog) {
  isRunning = true;
  try {
    addLog('🌐 Launching browser...');
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 720 },
    });
    page = await context.newPage();
    addLog('🔐 Logging into Instagram...');
    await page.goto('https://www.instagram.com/accounts/login/', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });
    await page.waitForTimeout(2000);
    await page.fill('input[name="username"]', username);
    await page.waitForTimeout(500);
    await page.fill('input[name="password"]', password);
    await page.waitForTimeout(500);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000);
    addLog('✅ Logged into Instagram successfully');
    try {
      await page.click('button:has-text("Not Now")', { timeout: 3000 });
    } catch {}
    try {
      await page.click('button:has-text("Not now")', { timeout: 3000 });
    } catch {}

    const topicMap = {
      1: 'Technology',
      2: 'Artificial Intelligence',
      3: 'Startups',
      4: 'Business',
      5: 'Finance',
      6: 'Fitness',
      7: 'Health',
      8: 'Education',
      9: 'Travel',
      10: 'Gaming',
    };

    const likedTopicIds = preferences?.liked || [1, 2, 3];
    const selectedTopics = likedTopicIds.map(id => topicMap[id]).filter(Boolean);
    addLog(`🎯 Topics: ${selectedTopics.join(', ')}`);

    let actionCount = 0;
    while (isRunning && actionCount < 20) {
      for (const topic of selectedTopics) {
        if (!isRunning) break;
        const tags = hashtags[topic];
        const tag = tags[Math.floor(Math.random() * tags.length)];
        addLog(`🔍 Exploring #${tag}...`);
        status.currentTopic = topic;
        try {
          await page.goto(`https://www.instagram.com/explore/tags/${tag}/`, {
            waitUntil: 'networkidle',
            timeout: 20000,
          });
          await page.waitForTimeout(3000);
          const posts = await page.$$('article img');
          if (posts.length > 0) {
            const randomPost = posts[Math.floor(Math.random() * Math.min(posts.length, 6))];
            await randomPost.click();
            await page.waitForTimeout(2000);
            try {
              const likeBtn = await page.$('svg[aria-label="Like"]');
              if (likeBtn) {
                await likeBtn.click();
                addLog(`❤️ Liked a post about ${topic}`);
                actionCount++;
                await page.waitForTimeout(2000);
              }
            } catch {}
            try {
              await page.keyboard.press('Escape');
            } catch {}
          }
          const delay = 3000 + Math.random() * 5000;
          await page.waitForTimeout(delay);
        } catch (err) {
          addLog(`⚠️ Skipped #${tag}: ${err.message.substring(0, 50)}`);
        }
      }
      actionCount++;
    }
    addLog('✅ Automation cycle complete');
    status.active = false;
  } catch (err) {
    addLog('❌ Error: ' + err.message);
    status.active = false;
  } finally {
    if (browser) {
      await browser.close();
      browser = null;
    }
    isRunning = false;
  }
}

async function stopAutomation() {
  isRunning = false;
  if (browser) {
    await browser.close();
    browser = null;
  }
}

function getStatus() {
  return { isRunning, browser: !!browser };
}

module.exports = { startAutomation, stopAutomation, getStatus };