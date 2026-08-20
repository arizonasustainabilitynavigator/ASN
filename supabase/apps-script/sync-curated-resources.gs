/**
 * Rebuilds a "Master" tab that combines every resource tab into one flat
 * table, then pushes it straight to Supabase. Completely free — no
 * third-party sync tool, just Google Apps Script talking to Supabase's
 * built-in REST API.
 *
 * Rewritten for the 12-tab "Data.xlsx" structure (Energy Efficiency &
 * Renewable, Water Conservation, Waste Reduction & Circularity,
 * Sustainable Procurement, Transportation & Fleet, Built Environment &
 * Facilities, Cross Sector Partnerships, Entrepreneurial Ecosystem
 * Support, Government Agency, Nonprofit Businesses, Small Businesses,
 * Grants & Funding). Every tab shares the same core columns (County, City,
 * Resource, Link, Phone, Email, Tags), so unlike the old ~80-tab sheet,
 * no per-tab special-casing (no-header tabs, URL-only tabs) is needed.
 */

// The spreadsheet this script operates on, opened explicitly by ID so this
// works whether the script is bound to the sheet or standalone.
var SPREADSHEET_ID = '1ht40q3Acrwc4YHNmuHfZ05o0l477Pj82NdoPcn9U8OI';

// Tabs to leave out of Master entirely.
var EXCLUDED_SHEETS = ['Master'];

function normalizeHeader(h) {
  return String(h || '').trim().toLowerCase();
}

// Maps each tab's header row to column roles, in order. Every tab shares
// County/City/Resource/Link/Phone/Email/Tags; after that, the first column
// whose header contains "category" becomes the broad category (e.g.
// "Action Category", "Support Category", "Agency Category" — these are all
// just each tab's name for the same thing), and a second one (if present)
// becomes the subcategory (e.g. "Energy Efficiency & Renewable Energy
// Category" — a finer breakdown some tabs have and others don't).
function buildColumnRoles(headerRow) {
  var roles = [];
  var categoryColsSeen = 0;

  for (var i = 0; i < headerRow.length; i++) {
    var h = normalizeHeader(headerRow[i]);
    var role = null;

    if (h === 'county') role = 'county';
    else if (h === 'city') role = 'city';
    else if (h === 'resource' || h === 'resource name') role = 'resource';
    else if (h === 'link') role = 'link';
    else if (h === 'phone') role = 'phone';
    else if (h === 'email') role = 'email';
    else if (h === 'tags') role = 'tags';
    else if (h.indexOf('category') !== -1) {
      categoryColsSeen++;
      role = categoryColsSeen === 1 ? 'category' : 'subcategory';
    }

    roles.push(role);
  }

  return roles;
}

// Retries a UrlFetchApp call up to 3 times with backoff, since occasional
// transient network/5xx failures against Supabase are expected over a
// script that runs every 15 minutes, and shouldn't fail the whole sync.
function fetchWithRetry(url, options) {
  var lastError;
  for (var attempt = 1; attempt <= 3; attempt++) {
    try {
      var resp = UrlFetchApp.fetch(url, options);
      if (resp.getResponseCode() < 500) return resp; // 4xx is a real error, don't retry
      lastError = new Error('HTTP ' + resp.getResponseCode() + ': ' + resp.getContentText());
    } catch (e) {
      lastError = e;
    }
    if (attempt < 3) Utilities.sleep(1000 * attempt);
  }
  throw lastError;
}

function readResourceSheet(sheet) {
  var values = sheet.getDataRange().getValues();
  if (values.length === 0) return [];

  var roles = buildColumnRoles(values[0]);
  var fallbackCategory = sheet.getName().trim();

  var rows = [];
  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    var out = {
      county: '', city: '', resource: '', link: '', phone: '', email: '',
      category: '', subcategory: '', tags: [],
    };

    for (var c = 0; c < row.length; c++) {
      var role = roles[c];
      if (!role || row[c] === '' || row[c] === null) continue;

      if (role === 'tags') {
        out.tags = String(row[c]).split(',').map(function (t) { return t.trim(); }).filter(Boolean);
      } else {
        out[role] = String(row[c]).trim();
      }
    }

    if (!out.category) out.category = fallbackCategory;
    if (out.resource || out.link) rows.push(out);
  }

  return rows;
}

function rebuildMasterTab() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheets = ss.getSheets();

  var master = ss.getSheetByName('Master');
  if (!master) {
    master = ss.insertSheet('Master');
  }
  master.clear();
  master.appendRow(['Category', 'Subcategory', 'County', 'City', 'Resource', 'Link', 'Phone', 'Email', 'Tags']);

  var allRows = [];

  for (var i = 0; i < sheets.length; i++) {
    var sheet = sheets[i];
    var name = sheet.getName();
    if (EXCLUDED_SHEETS.indexOf(name) !== -1) continue;

    var rows = readResourceSheet(sheet);
    for (var j = 0; j < rows.length; j++) {
      var r = rows[j];
      allRows.push([r.category, r.subcategory, r.county, r.city, r.resource, r.link, r.phone, r.email, r.tags.join(',')]);
    }
  }

  if (allRows.length > 0) {
    master.getRange(2, 1, allRows.length, 9).setValues(allRows);
  }

  Logger.log('Master rebuilt with ' + allRows.length + ' rows from ' + sheets.length + ' tabs.');
  return allRows;
}

/**
 * Pushes the Master tab's rows into the Supabase `curated_resources` table.
 * Free — uses Supabase's REST API directly, no third-party sync tool needed.
 *
 * Tags now come straight from each row's own Tags column in the sheet
 * (hand-picked, not guessed) — the `curated_resources_set_tags()` trigger
 * in Supabase was updated to leave an explicitly-provided `tags` value
 * alone instead of overwriting it with its old category/keyword guess.
 */
function pushToSupabase() {
  var props = PropertiesService.getScriptProperties();
  var supabaseUrl = props.getProperty('SUPABASE_URL');
  var serviceKey = props.getProperty('SUPABASE_SERVICE_KEY');

  if (!supabaseUrl || !serviceKey) {
    throw new Error(
      'Missing SUPABASE_URL or SUPABASE_SERVICE_KEY. Set them under ' +
      'Project Settings > Script Properties in the Apps Script editor.'
    );
  }

  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var master = ss.getSheetByName('Master');
  if (!master) throw new Error('No Master tab found — run rebuildMasterTab first.');

  var values = master.getDataRange().getValues();
  var rows = [];
  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    if (!row[4] && !row[5]) continue; // skip if both Resource and Link are empty
    var tagsStr = String(row[8] || '');
    rows.push({
      category: String(row[0] || ''),
      industry: String(row[1] || ''), // subcategory, reusing the existing `industry` column
      county: String(row[2] || ''),
      city: String(row[3] || ''),
      resource_name: String(row[4] || ''),
      link: String(row[5] || ''),
      phone: String(row[6] || ''),
      email: String(row[7] || ''),
      tag: String(row[0] || ''), // legacy singular column, mirrors category
      tags: tagsStr ? tagsStr.split(',').map(function (t) { return t.trim(); }).filter(Boolean) : [],
    });
  }

  var headers = {
    apikey: serviceKey,
    Authorization: 'Bearer ' + serviceKey,
    'Content-Type': 'application/json',
  };

  // Clear the table first so this run fully replaces old data.
  var deleteResp = fetchWithRetry(
    supabaseUrl + '/rest/v1/curated_resources?id=not.is.null',
    { method: 'delete', headers: headers, muteHttpExceptions: true }
  );
  if (deleteResp.getResponseCode() >= 300) {
    throw new Error('Failed to clear curated_resources: ' + deleteResp.getContentText());
  }

  // Insert in batches to stay well under request size limits.
  var BATCH_SIZE = 500;
  var inserted = 0;
  for (var i = 0; i < rows.length; i += BATCH_SIZE) {
    var batch = rows.slice(i, i + BATCH_SIZE);
    var resp = fetchWithRetry(supabaseUrl + '/rest/v1/curated_resources', {
      method: 'post',
      headers: headers,
      payload: JSON.stringify(batch),
      muteHttpExceptions: true,
    });
    if (resp.getResponseCode() >= 300) {
      throw new Error('Insert failed on batch starting at row ' + i + ': ' + resp.getContentText());
    }
    inserted += batch.length;
  }

  Logger.log('Pushed ' + inserted + ' rows to Supabase.');
}

/**
 * Runs the full pipeline: rebuild Master from all tabs, then push Master to
 * Supabase. This is the function to run manually or put on a time-driven
 * trigger.
 *
 * Wrapped in a script lock so a manual run can never overlap with the
 * scheduled trigger (or two triggers firing back-to-back if one run takes
 * longer than usual) — without this, two runs racing the delete-then-
 * reinsert against Supabase at the same time could leave the table
 * partially empty until the slower one finishes.
 */
function syncAll() {
  var lock = LockService.getScriptLock();
  var gotLock = lock.tryLock(5000);
  if (!gotLock) {
    Logger.log('Skipped: another sync is already running.');
    return;
  }

  try {
    rebuildMasterTab();
    pushToSupabase();
  } finally {
    lock.releaseLock();
  }
}

function setupTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'syncAll') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('syncAll')
    .timeBased()
    .everyMinutes(15)
    .create();
}
