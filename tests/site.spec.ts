import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { profile } from '../src/data/profile';

const email = process.env.CONTACT_EMAIL?.trim() ?? '';

test.describe('トップページ', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
  });

  test('主要なセクションが表示される', async ({ page }) => {
    await expect(page).toHaveTitle(profile.site.title);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(profile.tagline.lead);
    for (const id of ['about', 'works', 'writing', 'experience', 'contact']) {
      await expect(page.locator(`section#${id}`)).toBeAttached();
    }
    await expect(page.locator('#works article')).toHaveCount(profile.works.length);
  });

  test('横スクロールが発生しない', async ({ page }) => {
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('メールボタンは CONTACT_EMAIL があるときだけ表示され、mailto リンクになる', async ({ page }) => {
    const mail = page.locator('[data-mail-user]');
    if (email) {
      await expect(mail).toHaveAttribute('href', `mailto:${email}`);
    } else {
      await expect(mail).toHaveCount(0);
    }
  });

  test('アクセシビリティ上の重大な問題がない（axe）', async ({ page }) => {
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
  });
});

test.describe('掲載する作品', () => {
  test('すべて公開リポジトリへのリンクを持つ（非公開の作品は載せない）', () => {
    for (const w of profile.works) {
      expect(w.private, w.title).toBeFalsy();
      expect(w.repo, w.title).toMatch(/^https:\/\/github\.com\//);
    }
  });

  test('「掲載の個人開発」の数字が作品数と一致する', () => {
    const listed = profile.highlights.find((h) => h.label.includes('個人開発'));
    expect(Number(listed?.value)).toBe(profile.works.length);
  });
});

test.describe('公開してはいけない情報', () => {
  test('HTML にメールアドレス・電話番号がそのまま含まれない', async ({ request }) => {
    const html = await (await request.get('/')).text();
    if (email) expect(html).not.toContain(email);
    expect(html).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.]+/);
    expect(html).not.toMatch(/0[789]0-?\d{4}-?\d{4}/);
  });
});

test.describe('ターミナル', () => {
  test('「/」で開き、コマンドを実行でき、Esc で閉じる', async ({ page, isMobile }) => {
    test.skip(isMobile, 'キーボード操作はデスクトップのみ');
    await page.goto('/');
    const dialog = page.locator('dialog#terminal');

    await page.locator('body').press('/');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('portfolio-sh');

    const input = dialog.getByRole('textbox');
    await input.fill('works');
    await input.press('Enter');
    for (const w of profile.works) await expect(dialog).toContainText(w.title);

    await input.fill('constructor');
    await input.press('Enter');
    await expect(dialog).toContainText('command not found: constructor');

    await input.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('ボタンから開ける（タッチ端末向け）', async ({ page }) => {
    await page.goto('/');
    await page.locator('.nav [data-open-terminal]').click();
    const dialog = page.locator('dialog#terminal');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'skills' }).click();
    await expect(dialog).toContainText(profile.skills[0].name);
  });
});

test('存在しないページは 404 を返す', async ({ page }) => {
  const res = await page.goto('/no-such-page');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('404');
});
