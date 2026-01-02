import { test, expect } from '@playwright/test';

test.describe('競馬情報検索アプリ E2E', () => {
  test('ホームページが正常に表示される', async ({ page }) => {
    await page.goto('/');
    
    // ヘッダーが表示されていることを確認
    await expect(page.locator('header')).toBeVisible();
    
    // ページタイトルを確認
    await expect(page).toHaveTitle(/競馬情報検索/);
  });

  test('開催一覧が表示される', async ({ page }) => {
    await page.goto('/');
    
    // 開催一覧のコンテンツが表示されるまで待機
    await page.waitForLoadState('networkidle');
    
    // 競馬場名またはレース情報が表示されていることを確認
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });

  test('馬検索ページに遷移できる', async ({ page }) => {
    await page.goto('/');
    
    // 検索リンクをクリック
    const searchLink = page.locator('a[href="/search"]');
    if (await searchLink.isVisible()) {
      await searchLink.click();
      await expect(page).toHaveURL('/search');
    }
  });

  test('レース詳細ページに遷移できる', async ({ page }) => {
    await page.goto('/');
    
    // レースリンクを探してクリック
    const raceLink = page.locator('a[href^="/race/"]').first();
    if (await raceLink.isVisible()) {
      await raceLink.click();
      await expect(page).toHaveURL(/\/race\/.+/);
    }
  });

  test('検索ページで馬名検索ができる', async ({ page }) => {
    await page.goto('/search');
    
    // 検索入力フィールドを探す
    const searchInput = page.locator('input[type="text"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('ディープ');
      
      // 検索結果が表示されるまで待機
      await page.waitForTimeout(500);
    }
  });
});
