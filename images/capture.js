const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const repos = [
  '000-2025best-selection','000-gameluncher','001-neko_catch_game','002-kagoubutu_game',
  '003-amida-game','004-battle-game','005-meiro_game','006-eigo-game','007-iro_game',
  '008-sannaru_game','009-battle2-game','010-senntaku_game','011-kaimono_game',
  '012-buysell_game','013-histry','014-dokidoki','015-wakeup','016-nigeru',
  '017-action','018-rpg','019-rakka','020-taisyou','021-sanpo','022-city',
  '023-kyuusyoku','024-nekonekoneko','025-heiwa','026-bouzu','027-mayoimori',
  '028-quiz3','029-actionrpg2','030-yugudora','031-shoot','032-shoot2','033-nekubi',
  '034-demon_castle','035-gakuen','036-quiz4','037-RPG','038-codebraker','039-horaa',
  '040-kakuge','041-mitorizu','042-3Dshooting','043-kakuge2','044-actionRPG','045-mita',
  '046-dennsya','047-maikura','048-RPG2','049-tetoris','050-action-jamp','051-rulet',
  '052-bakusoku','053-SCAN-FIGHTERS','054-RPG3','055-block','056-tetoris2','057-inveder',
  '058-dainas','059-inveder-block','060-dennsya2','061-rizme','062-roguelite','063-rizme2',
  '064-pincman','065-RPG4','066-catquiz','067-race','068-rivers','069-bomb','070-ninja',
  '071-meiro2','072-salaryman','073-ehon','074-fishing','075-englishquest','076-metalslot',
  '077-eyecear','078-hakoniwa','079-kitakudash','080-coffeetalk','081-counter','082-tenchuuu',
  '083-bungaku','084-manegement','085-syoten','086-kessannsyo','087-matigai','088-tea',
  '089-amida2','090-sugoroku','091-inveder-neko','092-newyork','093-creather','094-salesman',
  '095-cooking','096-kitaku','097-furikaeri','098-aaa','099-tyouzou','100-DNA',
  '101-nikkisakusei','102-RPG-type1','103-actionjinnsei','104-parashoot','105-typpinggame',
  '106-copingcafe','107-cosmowalking','108-bearfait','109-crow-s-destiny',
  '110-newcrow-s-destiny','111-actioncat','112-RPGver1','113-business','114-battle_arena',
  '115-battle','116-cooking','116-fumifumi','117-bound','119-osero','121-coping100',
  '123-RPG-VER2','124-inveder-neko'
];

const BASE_URL = 'https://titan11111.github.io';
const OUT_DIR = path.dirname(__filename);
const TIMEOUT = 8000;
const WAIT = 3000;

async function capture() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });

  const results = [];

  for (const repo of repos) {
    const url = `${BASE_URL}/${repo}/`;
    const filename = `${repo}.png`;
    const filepath = path.join(OUT_DIR, filename);

    // すでに撮影済みはスキップ
    if (fs.existsSync(filepath)) {
      console.log(`⏭  skip: ${repo}`);
      results.push({ repo, status: 'skipped' });
      continue;
    }

    const page = await context.newPage();
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: TIMEOUT });
      await page.waitForTimeout(WAIT);
      await page.screenshot({ path: filepath, fullPage: false });
      console.log(`✅ ${repo}`);
      results.push({ repo, status: 'ok' });
    } catch (e) {
      console.log(`❌ ${repo}: ${e.message.split('\n')[0]}`);
      results.push({ repo, status: 'error', error: e.message.split('\n')[0] });
    } finally {
      await page.close();
    }
  }

  await browser.close();

  // 結果サマリー
  const ok = results.filter(r => r.status === 'ok').length;
  const err = results.filter(r => r.status === 'error').length;
  const skip = results.filter(r => r.status === 'skipped').length;
  console.log(`\n完了: ✅${ok}件 ❌${err}件 ⏭${skip}件`);
  fs.writeFileSync(path.join(OUT_DIR, 'results.json'), JSON.stringify(results, null, 2));
}

capture().catch(console.error);
