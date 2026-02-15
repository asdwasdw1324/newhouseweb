#!/usr/bin/env node

import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://sh.fang.ke.com';
const LIST_ROOT = '/loupan/';
const PAGE_SIZE = 10;

const REQUEST_TIMEOUT_MS = Number(process.env.CRAWL_TIMEOUT_MS || 30000);
const REQUEST_MIN_DELAY_MS = Number(process.env.CRAWL_MIN_DELAY_MS || 350);
const REQUEST_MAX_DELAY_MS = Number(process.env.CRAWL_MAX_DELAY_MS || 900);
const ROOT_MAX_PAGES = Number(process.env.CRAWL_ROOT_MAX_PAGES || 3);
const SHARD_MAX_PAGES = Number(process.env.CRAWL_SHARD_MAX_PAGES || 3);
const MAX_SLUGS = Number(process.env.CRAWL_MAX_SLUGS || 0);

const OUTPUT_FILE = path.join(process.cwd(), 'src', 'data', 'newHomes.ts');

const DISTRICT_ID_MAP = {
  '娴︿笢': 'pudong',
  '娴︿笢鏂板尯': 'pudong',
  '榛勬郸': 'huangpu',
  '寰愭眹': 'xuhui',
  '闀垮畞': 'changning',
  '闈欏畨': 'jingan',
  '鏅檧': 'putuo',
  '铏瑰彛': 'hongkou',
  '鏉ㄦ郸': 'yangpu',
  '闂佃': 'minhang',
  '瀹濆北': 'baoshan',
  '鍢夊畾': 'jiading',
  '鏉炬睙': 'songjiang',
  '闈掓郸': 'qingpu',
  '濂夎搐': 'fengxian',
  '宕囨槑': 'chongming',
  '閲戝北': 'jinshan'
};

const SHANGHAI_DISTRICT_IDS = new Set([
  'pudong',
  'huangpu',
  'xuhui',
  'changning',
  'jingan',
  'putuo',
  'hongkou',
  'yangpu',
  'minhang',
  'baoshan',
  'jiading',
  'songjiang',
  'qingpu',
  'fengxian',
  'chongming',
  'jinshan'
]);

function headers() {
  return {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    Referer: `${BASE_URL}${LIST_ROOT}`,
    Connection: 'keep-alive'
  };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function randomDelay() {
  const span = Math.max(0, REQUEST_MAX_DELAY_MS - REQUEST_MIN_DELAY_MS);
  return REQUEST_MIN_DELAY_MS + Math.floor(Math.random() * (span + 1));
}

function normalizeText(v) {
  return (v || '').replace(/\s+/g, ' ').trim();
}

function normalizeImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('/')) return `${BASE_URL}${url}`;
  return url;
}

function hashString(input) {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(36);
}

function getDistrictId(districtName) {
  const clean = normalizeText(districtName).replace(/鍖?/, '');
  if (DISTRICT_ID_MAP[clean]) return DISTRICT_ID_MAP[clean];
  return clean.toLowerCase() || 'unknown';
}

function isShanghaiDistrict(districtName) {
  return SHANGHAI_DISTRICT_IDS.has(getDistrictId(districtName));
}

function mapStatus(statusText) {
  const text = normalizeText(statusText);
  if (text.includes('寰呭敭')) return '寰呭敭';
  if (text.includes('鍞絼')) return '鍞絼';
  return '鍦ㄥ敭';
}

function parsePrice(text) {
  const matched = normalizeText(text).replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
  return matched ? Number(matched[1]) : 0;
}

function extractTotalPages($) {
  const totalCount = Number($('.page-box').first().attr('data-total-count') || 0);
  if (!Number.isFinite(totalCount) || totalCount <= 0) return 1;
  return Math.ceil(totalCount / PAGE_SIZE);
}

function isLoginOrBlocked(html) {
  const h = String(html || '');
  return h.includes('<title>鐧诲綍</title>') || h.includes('loginApp') || h.length < 2000;
}

function buildListUrl(basePath, page) {
  const cleaned = basePath.endsWith('/') ? basePath : `${basePath}/`;
  if (page <= 1) return `${BASE_URL}${cleaned}`;
  return `${BASE_URL}${cleaned}pg${page}/`;
}

async function fetchHtml(url) {
  const resp = await axios.get(url, {
    timeout: REQUEST_TIMEOUT_MS,
    headers: headers(),
    validateStatus: (s) => s >= 200 && s < 300
  });
  return String(resp.data || '');
}

function parseProjects($, sourceTag, page) {
  const projects = [];
  const items = $('li.resblock-list');

  for (let i = 0; i < items.length; i += 1) {
    const el = items.eq(i);

    const name =
      normalizeText(el.find('.resblock-name a').first().text()) ||
      normalizeText(el.find('.resblock-name').first().text());
    if (!name) continue;

    const locationSpans = el.find('.resblock-location span');
    const district = normalizeText(locationSpans.eq(0).text());
    const subDistrict = normalizeText(locationSpans.eq(1).text());
    const address = normalizeText(el.find('.resblock-location a').first().text());
    if (!isShanghaiDistrict(district)) continue;

    const price = parsePrice(el.find('.resblock-price .main-price .number').first().text());
    const priceUnit = normalizeText(el.find('.resblock-price .main-price .desc').first().text()) || '鍏?銕?鍧囦环)';
    const areaRange = normalizeText(el.find('.resblock-area').first().text());
    const status = mapStatus(el.find('.sale-status').first().text());

    const features = el
      .find('.resblock-tag span')
      .map((_, node) => normalizeText($(node).text()))
      .get()
      .filter(Boolean);

    const image = normalizeImageUrl(
      el.find('.resblock-img-wrapper img').attr('data-original') ||
        el.find('.resblock-img-wrapper img').attr('src') ||
        ''
    );

    const districtId = getDistrictId(district);
    const uniq = `${name}|${address || district}|${districtId}`;

    projects.push({
      id: `lj-${hashString(uniq)}`,
      name,
      districtId,
      subDistrictId: subDistrict || district,
      price,
      priceUnit,
      area: 0,
      areaRange,
      status,
      features,
      description: `${name}浣嶄簬${district}${subDistrict ? ` ${subDistrict}` : ''}${features.length ? `锛?{features.join('銆?)}` : ''}`,
      image: image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      developer: '',
      address: address || `${district}${subDistrict}`,
      coordinates: {
        lat: 31.23 + (Math.random() - 0.5) * 0.2,
        lng: 121.47 + (Math.random() - 0.5) * 0.2
      },
      __source: `${sourceTag}:p${page}`
    });
  }

  return projects;
}

function dedupe(projects) {
  const seen = new Set();
  const out = [];
  for (const p of projects) {
    const key = `${p.name}|${p.address}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out;
}

function loadSeedSlugs() {
  const seeds = new Set([
    'pudong', 'minhang', 'xuhui', 'changning', 'huangpu', 'jingan', 'putuo', 'hongkou', 'yangpu',
    'baoshan', 'jiading', 'songjiang', 'qingpu', 'fengxian', 'jinshan', 'chongming'
  ]);

  const file = path.join(process.cwd(), 'src', 'data', 'districts.ts');
  if (fs.existsSync(file)) {
    const text = fs.readFileSync(file, 'utf8');
    const re = /id:\s*'([a-z0-9]+)'/g;
    let m;
    while ((m = re.exec(text)) !== null) {
      const slug = m[1];
      if (slug && slug.length >= 2 && slug !== 'unknown') {
        seeds.add(slug);
      }
    }
  }

  return Array.from(seeds);
}

async function discoverSlugsFromHome() {
  const html = await fetchHtml(`${BASE_URL}${LIST_ROOT}`);
  const $ = cheerio.load(html);
  const slugs = new Set();

  $('a').each((_, node) => {
    const href = normalizeText($(node).attr('href') || '');
    if (!href) return;

    const matched = href.match(/(?:https?:)?\/\/sh\.fang\.ke\.com\/loupan\/([a-z0-9]+)\/?$/i)
      || href.match(/^\/loupan\/([a-z0-9]+)\/?$/i);

    if (!matched) return;

    const slug = matched[1].toLowerCase();
    if (!slug) return;

    if (slug.startsWith('p_')) return;
    if (/^pg\d+$/.test(slug)) return;

    slugs.add(slug);
  });

  return Array.from(slugs);
}

async function crawlPath(basePath, maxPages, tag) {
  const all = [];
  let totalPages = maxPages;

  for (let page = 1; page <= totalPages; page += 1) {
    const url = buildListUrl(basePath, page);

    try {
      const html = await fetchHtml(url);
      if (isLoginOrBlocked(html)) {
        console.log(`[crawl] blocked at ${tag} page=${page}`);
        break;
      }

      const $ = cheerio.load(html);
      if (page === 1) {
        const detected = extractTotalPages($);
        totalPages = Math.min(maxPages, Math.max(1, detected));
      }

      const items = parseProjects($, tag, page);
      if (items.length === 0) {
        console.log(`[crawl] empty ${tag} page=${page}`);
        break;
      }

      all.push(...items);
      console.log(`[crawl] ${tag} ${page}/${totalPages}: ${items.length}`);
    } catch (e) {
      console.log(`[crawl] fail ${tag} page=${page}: ${e.message}`);
    }

    await sleep(randomDelay());
  }

  return all;
}

function generateTs(projects) {
  const list = projects.map(({ __source, ...rest }) => rest);

  return `/**
 * 涓婃捣鏂版埧椤圭洰鏁版嵁
 * 浠庨摼瀹剁綉绔欐姄鍙栫殑鐪熷疄鏁版嵁
 * Generated at: ${new Date().toISOString()}
 */

export interface NewHomeProject {
  id: string;
  name: string;
  districtId: string;
  subDistrictId: string;
  price: number;
  priceUnit: string;
  area: number;
  areaRange: string;
  status: '鍦ㄥ敭' | '寰呭敭' | '鍞絼';
  publishDate?: string;
  floorRange?: string;
  features: string[];
  description: string;
  image: string;
  developer: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const newHomeProjects: NewHomeProject[] = ${JSON.stringify(list, null, 2)};

export const getProjectsByDistrict = (districtId: string): NewHomeProject[] => {
  return newHomeProjects.filter((project) => project.districtId === districtId);
};

export const getProjectsBySubDistrict = (districtId: string, subDistrictId: string): NewHomeProject[] => {
  return newHomeProjects.filter(
    (project) => project.districtId === districtId && project.subDistrictId === subDistrictId
  );
};

export const getProjectById = (id: string): NewHomeProject | undefined => {
  return newHomeProjects.find((project) => project.id === id);
};

export const getRandomProjects = (count: number): NewHomeProject[] => {
  const shuffled = [...newHomeProjects].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getOnlyNewHomes = (): NewHomeProject[] => {
  return newHomeProjects.filter((project) => project.status === '鍦ㄥ敭' || project.status === '寰呭敭');
};

export const addLianjiaProjects = (lianjiaProjects: NewHomeProject[]): NewHomeProject[] => {
  return [...newHomeProjects, ...lianjiaProjects];
};
`;
}

async function main() {
  console.log('[crawl] strategy: root + shard crawl');
  const raw = [];

  raw.push(...(await crawlPath('/loupan/', ROOT_MAX_PAGES, 'root')));

  const seedSlugs = loadSeedSlugs();
  const discovered = await discoverSlugsFromHome();
  const discoveredSlugs = Array.from(new Set([...seedSlugs, ...discovered]));
  const slugs = MAX_SLUGS > 0 ? discoveredSlugs.slice(0, MAX_SLUGS) : discoveredSlugs;

  console.log(`[crawl] shard slugs: ${slugs.length}`);

  for (let i = 0; i < slugs.length; i += 1) {
    const slug = slugs[i];
    const basePath = `/loupan/${slug}/`;
    const tag = `slug:${slug}`;

    const items = await crawlPath(basePath, SHARD_MAX_PAGES, tag);
    raw.push(...items);

    if ((i + 1) % 25 === 0) {
      const dedupedMid = dedupe(raw);
      console.log(`[crawl] progress ${i + 1}/${slugs.length}, raw=${raw.length}, deduped=${dedupedMid.length}`);
    }
  }

  const deduped = dedupe(raw);
  if (deduped.length === 0) {
    throw new Error('No projects crawled.');
  }

  fs.writeFileSync(OUTPUT_FILE, generateTs(deduped), 'utf8');
  console.log(`[crawl] done raw=${raw.length} deduped=${deduped.length}`);
  console.log(`[crawl] wrote ${OUTPUT_FILE}`);
}

main().catch((e) => {
  console.error('[crawl] failed:', e.message);
  process.exitCode = 1;
});
