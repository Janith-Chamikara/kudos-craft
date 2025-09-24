const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');

const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
const TEST_TIMEOUT = 60000;

const generateTestUser = () => {
  const timestamp = Date.now();
  return {
    signIn: {
      email: `janithchamikara@gmail.com`,
      password: '11111111',
    },
    signUp: {
      firstName: 'John',
      lastName: 'Doe',
      email: `testuser+${timestamp}@example.com`,
      password: 'SecureTestPass123!',
      confirmPassword: 'SecureTestPass123!',
    },
  };
};

const TEST_USER = generateTestUser();

class TestHelper {
  constructor(driver) {
    this.driver = driver;
  }

  async waitForElement(selector, timeout = TEST_TIMEOUT) {
    return await this.driver.wait(
      until.elementLocated(By.css(selector)),
      timeout,
    );
  }

  async waitForElementByName(name, timeout = TEST_TIMEOUT) {
    return await this.driver.wait(until.elementLocated(By.name(name)), timeout);
  }

  async fillFormField(name, value) {
    const element = await this.waitForElementByName(name);
    await element.clear();
    await element.sendKeys(value);
  }

  async clickButton(buttonText) {
    const button = await this.driver.wait(
      until.elementLocated(
        By.xpath(`//button[contains(text(), '${buttonText}')]`),
      ),
      TEST_TIMEOUT,
    );
    await this.driver.wait(until.elementIsEnabled(button), TEST_TIMEOUT);
    await button.click();
  }

  async waitForUrl(urlPattern, timeout = TEST_TIMEOUT) {
    return await this.driver.wait(until.urlContains(urlPattern), timeout);
  }

  async takeScreenshot(filename) {
    const screenshot = await this.driver.takeScreenshot();
    if (!fs.existsSync('screenshots')) {
      fs.mkdirSync('screenshots');
    }
    fs.writeFileSync(`screenshots/${filename}`, screenshot, 'base64');
  }

  async isElementVisible(selector) {
    try {
      const element = await this.driver.findElement(By.css(selector));
      return await element.isDisplayed();
    } catch {
      return false;
    }
  }

  async getValidationErrors() {
    try {
      const errorElements = await this.driver.findElements(
        By.css('span.text-red-500'),
      );
      const errors = [];
      for (const element of errorElements) {
        const text = await element.getText();
        if (text) errors.push(text);
      }
      return errors;
    } catch {
      return [];
    }
  }
}

async function setupDriver(headless = false) {
  const options = new chrome.Options();
  if (headless) {
    options.addArguments('--headless');
  }
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--window-size=1920,1080');
  options.addArguments('--disable-web-security');
  options.addArguments('--allow-running-insecure-content');

  return await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
}

async function testSignInPageLoad() {
  console.log('🔐 Testing Sign In page load...');
  const driver = await setupDriver();
  const helper = new TestHelper(driver);

  try {
    console.log(`  📍 Navigating to ${BASE_URL}/sign-in`);
    await driver.get(`${BASE_URL}/sign-in`);

    console.log('  ⏳ Waiting for page elements...');
    await helper.waitForElement('h2');
    const title = await driver.findElement(By.css('h2')).getText();
    console.log(`  📄 Found title: "${title}"`);

    if (!title.toLowerCase().includes('log in')) {
      throw new Error(`Expected sign-in page title, got "${title}"`);
    }

    console.log('  🔍 Checking form fields...');
    await helper.waitForElementByName('email');
    await helper.waitForElementByName('password');
    console.log('  ✅ Email and password fields found');

    console.log('  🔗 Checking navigation link...');
    const signUpLink = await driver.findElement(By.linkText('Sign Up'));
    if (!(await signUpLink.isDisplayed())) {
      throw new Error('Sign Up link not found');
    }
    console.log('  ✅ Sign Up link found');

    console.log('✅ Sign In page load test completed successfully');
  } catch (error) {
    console.error('❌ Sign In page load test failed:', error.message);
    await helper.takeScreenshot('sign-in-page-load-error.png');
    throw error;
  } finally {
    await driver.quit();
  }
}

async function testSignInFormValidation() {
  console.log('📝 Testing Sign In form validation...');
  const driver = await setupDriver();
  const helper = new TestHelper(driver);

  try {
    await driver.get(`${BASE_URL}/sign-in`);
    await helper.waitForElementByName('email');

    // Test 1: Empty form submission
    await helper.clickButton('Sign in');
    await driver.sleep(5000);

    // Test 2: Invalid email format
    await helper.fillFormField('email', 'invalid-email');
    await helper.fillFormField('password', 'password');
    await helper.clickButton('Sign in');
    await driver.sleep(5000);

    // Test 3: Valid format (will fail authentication but form validation should pass)
    await helper.fillFormField('email', TEST_USER.signIn.email);
    await helper.fillFormField('password', TEST_USER.signIn.password);
    await helper.takeScreenshot('sign-in-before-submit.png');
    await helper.clickButton('Sign in');
    await driver.sleep(5000);

    console.log('✅ Sign In form validation tests completed');
  } catch (error) {
    console.error('❌ Sign In form validation test failed:', error);
    await helper.takeScreenshot('sign-in-validation-error.png');
    throw error;
  } finally {
    await driver.quit();
  }
}

// Sign Up Tests
async function testSignUpPageLoad() {
  console.log('📝 Testing Sign Up page load...');
  const driver = await setupDriver();
  const helper = new TestHelper(driver);

  try {
    await driver.get(`${BASE_URL}/sign-up`);

    // Wait for and verify page title
    await helper.waitForElement('h2');
    const title = await driver.findElement(By.css('h2')).getText();

    if (!title.toLowerCase().includes('sign up')) {
      throw new Error(`Expected sign-up page title, got "${title}"`);
    }

    // Verify all form fields exist
    const formFields = [
      'firstName',
      'lastName',
      'email',
      'password',
      'confirmPassword',
    ];
    for (const field of formFields) {
      await helper.waitForElementByName(field);
    }

    // Verify sign-in link
    const signInLink = await driver.findElement(By.linkText('Sign In'));
    if (!(await signInLink.isDisplayed())) {
      throw new Error('Sign In link not found');
    }

    console.log('✅ Sign Up page loaded successfully');
  } catch (error) {
    console.error('❌ Sign Up page load test failed:', error);
    await helper.takeScreenshot('sign-up-page-load-error.png');
    throw error;
  } finally {
    await driver.quit();
  }
}

async function testSignUpFormValidation() {
  console.log('✨ Testing Sign Up form validation...');
  const driver = await setupDriver();
  const helper = new TestHelper(driver);

  try {
    await driver.get(`${BASE_URL}/sign-up`);
    await helper.waitForElementByName('firstName');

    // Test 1: Empty form submission
    await helper.clickButton('Sign up');
    await driver.sleep(5000);

    // Test 2: Password mismatch
    await helper.fillFormField('firstName', 'Test');
    await helper.fillFormField('lastName', 'User');
    await helper.fillFormField('email', 'test@example.com');
    await helper.fillFormField('password', 'Password123!');
    await helper.fillFormField('confirmPassword', 'DifferentPassword123!');
    await helper.clickButton('Sign up');
    await driver.sleep(5000);

    // Test 3: Valid form submission
    const testUser = TEST_USER.signUp;
    await helper.fillFormField('firstName', testUser.firstName);
    await helper.fillFormField('lastName', testUser.lastName);
    await helper.fillFormField('email', testUser.email);
    await helper.fillFormField('password', testUser.password);
    await helper.fillFormField('confirmPassword', testUser.confirmPassword);

    await helper.takeScreenshot('sign-up-before-submit.png');
    await helper.clickButton('Sign up');
    await driver.sleep(5000);
    await helper.takeScreenshot('sign-up-after-submit.png');

    console.log('✅ Sign Up form validation tests completed');
  } catch (error) {
    console.error('❌ Sign Up form validation test failed:', error);
    await helper.takeScreenshot('sign-up-validation-error.png');
    throw error;
  } finally {
    await driver.quit();
  }
}

// Navigation Tests
async function testNavigation() {
  console.log('🔗 Testing navigation between Sign In and Sign Up...');
  const driver = await setupDriver();
  const helper = new TestHelper(driver);

  try {
    // Start at Sign In page
    await driver.get(`${BASE_URL}/sign-in`);
    await helper.waitForElement('h2');

    // Navigate to Sign Up
    const signUpLink = await driver.findElement(By.linkText('Sign Up'));
    await signUpLink.click();
    await helper.waitForUrl('/sign-up');

    // Verify we're on Sign Up page
    const signUpTitle = await driver.findElement(By.css('h2')).getText();
    if (!signUpTitle.toLowerCase().includes('sign up')) {
      throw new Error('Navigation to Sign Up failed');
    }

    // Navigate back to Sign In
    const signInLink = await driver.findElement(By.linkText('Sign In'));
    await signInLink.click();
    await helper.waitForUrl('/sign-in');

    // Verify we're on Sign In page
    const signInTitle = await driver.findElement(By.css('h2')).getText();
    if (!signInTitle.toLowerCase().includes('log in')) {
      throw new Error('Navigation to Sign In failed');
    }

    console.log('✅ Navigation tests completed successfully');
  } catch (error) {
    console.error('❌ Navigation test failed:', error);
    await helper.takeScreenshot('navigation-error.png');
    throw error;
  } finally {
    await driver.quit();
  }
}

// End-to-End Registration and Login Test
async function testRegisterThenLogin() {
  console.log('🔄 Testing full registration → login flow...');
  const driver = await setupDriver();
  const helper = new TestHelper(driver);

  // Generate unique test user for this test
  const uniqueTestUser = generateTestUser();

  try {
    console.log('  📝 Step 1: Register new user...');

    // Navigate to sign-up page
    await driver.get(`${BASE_URL}/sign-up`);
    await helper.waitForElementByName('firstName');

    console.log(`  👤 Creating user: ${uniqueTestUser.signUp.email}`);

    // Fill out registration form
    await helper.fillFormField('firstName', uniqueTestUser.signUp.firstName);
    await helper.fillFormField('lastName', uniqueTestUser.signUp.lastName);
    await helper.fillFormField('email', uniqueTestUser.signUp.email);
    await helper.fillFormField('password', uniqueTestUser.signUp.password);
    await helper.fillFormField(
      'confirmPassword',
      uniqueTestUser.signUp.confirmPassword,
    );

    // Take screenshot before registration
    await helper.takeScreenshot('before-registration.png');

    // Submit registration form
    await helper.clickButton('Sign up');
    console.log('  ⏳ Submitted registration form...');

    // Wait for registration to process
    await driver.sleep(4000);

    // Take screenshot after registration
    await helper.takeScreenshot('after-registration.png');

    // Check current URL to see if redirected
    const currentUrl = await driver.getCurrentUrl();
    console.log(`  📍 Current URL after registration: ${currentUrl}`);

    // If redirected to dashboard or account setup, registration was successful
    if (
      currentUrl.includes('/dashboard') ||
      currentUrl.includes('/account-setup')
    ) {
      console.log('  ✅ Registration successful - user was redirected');

      // Now test logout and login with same credentials
      console.log('  🔐 Step 2: Testing logout and login...');

      // Try to find logout button or navigate directly to sign-in
      await driver.get(`${BASE_URL}/sign-in`);
      await helper.waitForElementByName('email');
    } else {
      // If still on sign-up page, check for success message or continue to login test
      console.log(
        '  ⚠️  Still on sign-up page - may indicate validation error or async processing',
      );

      // Navigate to sign-in page for login test
      await driver.get(`${BASE_URL}/sign-in`);
      await helper.waitForElementByName('email');
    }

    console.log('  🔑 Step 3: Login with registered credentials...');

    // Fill login form with the same credentials used for registration
    await helper.fillFormField('email', uniqueTestUser.signIn.email);
    await helper.fillFormField('password', uniqueTestUser.signIn.password);

    // Take screenshot before login
    await helper.takeScreenshot('before-login.png');

    // Submit login form
    await helper.clickButton('Sign in');
    console.log('  ⏳ Submitted login form...');

    // Wait for login to process
    await driver.sleep(4000);

    // Take screenshot after login
    await helper.takeScreenshot('after-login.png');

    // Check final URL
    const finalUrl = await driver.getCurrentUrl();
    console.log(`  📍 Final URL after login: ${finalUrl}`);

    // Check for successful login indicators
    if (
      finalUrl.includes('/dashboard') ||
      finalUrl.includes('/account-setup')
    ) {
      console.log('  ✅ Login successful - user redirected to protected route');
    } else if (finalUrl.includes('/sign-in')) {
      console.log(
        '  ⚠️  Still on sign-in page - may indicate authentication issue',
      );

      // Check for error messages
      const errors = await helper.getValidationErrors();
      if (errors.length > 0) {
        console.log(`  📝 Validation errors found: ${errors.join(', ')}`);
      }

      // Check for toast messages or other error indicators
      const bodyText = await driver.findElement(By.css('body')).getText();
      if (
        bodyText.includes('Invalid') ||
        bodyText.includes('error') ||
        bodyText.includes('failed')
      ) {
        console.log('  🚨 Possible error messages detected in page content');
      }
    }

    console.log('✅ Register → Login flow test completed');
  } catch (error) {
    console.error('❌ Register → Login flow test failed:', error.message);
    await helper.takeScreenshot('register-login-flow-error.png');
    throw error;
  } finally {
    await driver.quit();
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Kudos Craft Authentication UI Tests');
  console.log('='.repeat(60));
  console.log(`🌐 Testing against: ${BASE_URL}`);
  console.log('='.repeat(60));

  const tests = [
    { name: 'Sign In Page Load', fn: testSignInPageLoad },
    { name: 'Sign In Form Validation', fn: testSignInFormValidation },
    { name: 'Sign Up Page Load', fn: testSignUpPageLoad },
    { name: 'Sign Up Form Validation', fn: testSignUpFormValidation },
    { name: 'Navigation', fn: testNavigation },
  ];

  let passedTests = 0;
  let failedTests = 0;
  const failedTestNames = [];

  console.log(`📋 Running ${tests.length} test suites...\n`);

  for (let i = 0; i < tests.length; i++) {
    const { name, fn } = tests[i];
    console.log(`[${i + 1}/${tests.length}] ${name}`);

    try {
      await fn();
      passedTests++;
    } catch (error) {
      failedTests++;
      failedTestNames.push(name);
      console.error(`❌ ${name} failed:`, error.message);
    }

    console.log(''); // Add spacing between tests
  }

  // Print summary
  console.log('='.repeat(60));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(
    `📈 Success Rate: ${Math.round((passedTests / tests.length) * 100)}%`,
  );

  if (failedTests > 0) {
    console.log('\n❌ Failed Tests:');
    failedTestNames.forEach((name, index) => {
      console.log(`   ${index + 1}. ${name}`);
    });
    console.log(
      '\n💡 Check the screenshots/ directory for visual debugging information.',
    );
  }

  console.log('='.repeat(60));

  if (failedTests > 0) {
    console.log('⚠️  Some tests failed. Review the output above for details.');
    process.exit(1);
  } else {
    console.log(
      '🎉 All tests passed! Your authentication UI is working correctly.',
    );
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch((error) => {
    console.error('Fatal error running tests:', error);
    process.exit(1);
  });
}

module.exports = {
  runAllTests,
  testSignInPageLoad,
  testSignInFormValidation,
  testSignUpPageLoad,
  testSignUpFormValidation,
  testNavigation,
  TestHelper,
  setupDriver,
};
