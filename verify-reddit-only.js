#!/usr/bin/env node

/**
 * Verification Script: Reddit-Only Scraping Configuration
 *
 * This script verifies that the system is properly configured for Reddit-exclusive scraping.
 */

import { Community } from "./src/models/community.model.js";
import { ScraperManager } from "./src/scrapers/ScraperManager.js";

console.log("🔍 Verifying Reddit-Only Scraping Configuration\n");
console.log("=" .repeat(60));

const verificationResults = {
  passed: [],
  failed: [],
  warnings: []
};

function addResult(category, test, status, message) {
  const result = { test, status, message };
  verificationResults[category].push(result);

  const icon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⚠️';
  console.log(`${icon} ${test}: ${message}`);
}

// Test 1: ScraperManager has only Reddit scraper
console.log("\n📋 Test 1: Scraper Manager Configuration");
const scraperManager = new ScraperManager();
const scraperPlatforms = Object.keys(scraperManager.scrapers);

if (scraperPlatforms.length === 1 && scraperPlatforms[0] === 'reddit') {
  addResult('passed', 'Scraper Manager', 'pass',
    'Only Reddit scraper is configured');
} else {
  addResult('failed', 'Scraper Manager', 'fail',
    `Found ${scraperPlatforms.length} scrapers: ${scraperPlatforms.join(', ')}`);
}

// Test 2: Check if Reddit scraper has authenticity filter
console.log("\n📋 Test 2: Reddit Scraper Features");
const redditScraper = scraperManager.scrapers.reddit;

if (typeof redditScraper.isAuthenticPost === 'function') {
  addResult('passed', 'Authenticity Filter', 'pass',
    'isAuthenticPost() method exists');
} else {
  addResult('failed', 'Authenticity Filter', 'fail',
    'isAuthenticPost() method not found');
}

if (typeof redditScraper.scrapeContent === 'function') {
  addResult('passed', 'Scraping Method', 'pass',
    'scrapeContent() method exists');
} else {
  addResult('failed', 'Scraping Method', 'fail',
    'scrapeContent() method not found');
}

if (typeof redditScraper.scrapePostComments === 'function') {
  addResult('passed', 'Comment Scraping', 'pass',
    'scrapePostComments() method exists');
} else {
  addResult('failed', 'Comment Scraping', 'fail',
    'scrapePostComments() method not found');
}

// Test 3: Verify rate limiting
console.log("\n📋 Test 3: Rate Limiting Configuration");
if (redditScraper.rateLimitDelay === 2000) {
  addResult('passed', 'Rate Limiting', 'pass',
    '2-second rate limit configured');
} else {
  addResult('warnings', 'Rate Limiting', 'warning',
    `Rate limit is ${redditScraper.rateLimitDelay}ms (expected 2000ms)`);
}

// Test 4: Verify utility classes exist
console.log("\n📋 Test 4: Support Classes");
const hasUtils = !!scraperManager.utils;
const hasProcessor = !!scraperManager.contentProcessor;
const hasValidator = !!scraperManager.contentValidator;
const hasCommentGen = !!scraperManager.commentGenerator;

if (hasUtils && hasProcessor && hasValidator && hasCommentGen) {
  addResult('passed', 'Support Classes', 'pass',
    'All support classes initialized');
} else {
  const missing = [];
  if (!hasUtils) missing.push('ScrapingUtils');
  if (!hasProcessor) missing.push('ContentProcessor');
  if (!hasValidator) missing.push('ContentValidator');
  if (!hasCommentGen) missing.push('CommentGenerator');

  addResult('failed', 'Support Classes', 'fail',
    `Missing: ${missing.join(', ')}`);
}

// Print Summary
console.log("\n" + "=".repeat(60));
console.log("📊 VERIFICATION SUMMARY");
console.log("=".repeat(60));

console.log(`\n✅ Passed: ${verificationResults.passed.length}`);
verificationResults.passed.forEach(r =>
  console.log(`   - ${r.test}: ${r.message}`)
);

if (verificationResults.warnings.length > 0) {
  console.log(`\n⚠️  Warnings: ${verificationResults.warnings.length}`);
  verificationResults.warnings.forEach(r =>
    console.log(`   - ${r.test}: ${r.message}`)
  );
}

if (verificationResults.failed.length > 0) {
  console.log(`\n❌ Failed: ${verificationResults.failed.length}`);
  verificationResults.failed.forEach(r =>
    console.log(`   - ${r.test}: ${r.message}`)
  );
}

// Final status
console.log("\n" + "=".repeat(60));
if (verificationResults.failed.length === 0) {
  console.log("✅ ✅ ✅  ALL TESTS PASSED  ✅ ✅ ✅");
  console.log("\n🎉 System is properly configured for Reddit-only scraping!");
  console.log("\n📚 See REDDIT_SCRAPING_GUIDE.md for complete documentation");
  console.log("📋 See REDDIT_IMPLEMENTATION_SUMMARY.md for change details");
  process.exit(0);
} else {
  console.log("❌ ❌ ❌  VERIFICATION FAILED  ❌ ❌ ❌");
  console.log("\n⚠️  Please review failed tests and fix configuration issues.");
  process.exit(1);
}
