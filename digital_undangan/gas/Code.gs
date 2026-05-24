// ============================================================
// Digital Wedding Invitation — Google Apps Script Backend
// ============================================================
// This file handles two endpoints:
//   doGet(e)  → Fetch client data by slug from "DataKlien" tab
//   doPost(e) → Save RSVP submission to "RSVP" tab
//
// DEPLOYMENT:
//   1. Open Google Sheets → Extensions → Apps Script
//   2. Paste this code into Code.gs
//   3. Deploy → New deployment → Web app
//   4. Execute as: "Me"
//   5. Who has access: "Anyone"
//   6. Copy the /exec URL into your .env.local
// ============================================================

/**
 * Helper: Create a JSON response with proper content type.
 * Google Apps Script does not support custom CORS headers,
 * but deployed-as-"Anyone" web apps handle CORS automatically
 * for simple requests (GET, and POST with text/plain).
 */
function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * GET Handler — Fetch client data by slug.
 *
 * Usage: GET {GAS_URL}?slug=andi-nina
 *
 * Searches the "DataKlien" sheet for a row where column A matches the slug.
 * Returns the row data as a JSON object with named fields.
 */
function doGet(e) {
  try {
    var slug = e.parameter.slug;

    if (!slug) {
      return createJsonResponse({
        status: "error",
        message: "Parameter 'slug' diperlukan"
      });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("DataKlien");

    if (!sheet) {
      return createJsonResponse({
        status: "error",
        message: "Sheet 'DataKlien' tidak ditemukan"
      });
    }

    var data = sheet.getDataRange().getValues();
    var headers = data[0]; // First row = headers
    var result = null;

    // Search for matching slug in column A (index 0)
    for (var i = 1; i < data.length; i++) {
      if (data[i][0].toString().trim().toLowerCase() === slug.trim().toLowerCase()) {
        result = {};
        for (var j = 0; j < headers.length; j++) {
          result[headers[j].toString().trim()] = data[i][j];
        }
        break;
      }
    }

    if (result) {
      return createJsonResponse({
        status: "success",
        data: result
      });
    } else {
      return createJsonResponse({
        status: "error",
        message: "Data untuk slug '" + slug + "' tidak ditemukan"
      });
    }

  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: "Terjadi kesalahan server: " + error.toString()
    });
  }
}

/**
 * POST Handler — Save an RSVP submission.
 *
 * Accepts JSON payload (sent as text/plain to bypass CORS preflight):
 * {
 *   "slug": "andi-nina",
 *   "nama_tamu": "Budi Santoso",
 *   "kehadiran": "Hadir",
 *   "pesan": "Selamat menempuh hidup baru!"
 * }
 *
 * Appends a new row to the "RSVP" sheet with a timestamp.
 */
function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);

    var slug = payload.slug;
    var nama_tamu = payload.nama_tamu;
    var kehadiran = payload.kehadiran;
    var pesan = payload.pesan;

    // Validate required fields
    if (!slug || !nama_tamu || !kehadiran) {
      return createJsonResponse({
        status: "error",
        message: "Field slug, nama_tamu, dan kehadiran wajib diisi"
      });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("RSVP");

    if (!sheet) {
      return createJsonResponse({
        status: "error",
        message: "Sheet 'RSVP' tidak ditemukan"
      });
    }

    // Append new row: slug | nama_tamu | kehadiran | pesan | timestamp
    var timestamp = new Date();
    sheet.appendRow([slug, nama_tamu, kehadiran, pesan || "", timestamp]);

    return createJsonResponse({
      status: "success",
      message: "RSVP berhasil disimpan"
    });

  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: "Terjadi kesalahan server: " + error.toString()
    });
  }
}

function setupDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Setup Sheet DataKlien
  var sheetKlien = ss.getSheetByName("DataKlien");
  if (!sheetKlien) {
    sheetKlien = ss.insertSheet("DataKlien");
  }
  
  // Set Header untuk DataKlien
  var headersKlien = ["slug", "theme_id", "nama_pria", "nama_wanita", "tanggal_akad", "lokasi_akad", "url_foto_cover"];
  sheetKlien.getRange(1, 1, 1, headersKlien.length).setValues([headersKlien]);
  sheetKlien.getRange(1, 1, 1, headersKlien.length).setFontWeight("bold");
  sheetKlien.setFrozenRows(1);
  
  // Masukkan Dummy Data jika sheet masih kosong (hanya ada header)
  if (sheetKlien.getLastRow() === 1) {
    var dummyData = ["romeo-juliet", "elegant", "Romeo", "Juliet", "2026-12-31", "Gedung Serbaguna Jakarta", ""];
    sheetKlien.appendRow(dummyData);
  }

  // 2. Setup Sheet RSVP
  var sheetRsvp = ss.getSheetByName("RSVP");
  if (!sheetRsvp) {
    sheetRsvp = ss.insertSheet("RSVP");
  }
  
  // Set Header untuk RSVP
  var headersRsvp = ["slug", "nama_tamu", "kehadiran", "pesan", "timestamp"];
  sheetRsvp.getRange(1, 1, 1, headersRsvp.length).setValues([headersRsvp]);
  sheetRsvp.getRange(1, 1, 1, headersRsvp.length).setFontWeight("bold");
  sheetRsvp.setFrozenRows(1);
  
  Logger.log("Instalasi Database selesai! Cek Google Sheets kamu.");
}