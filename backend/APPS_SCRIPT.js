// backend/APPS_SCRIPT.js
/**
 * Google Apps Script Web App for "Té Daniel" RSVP Form
 * Saves to Google Sheets + sends email notifications.
 *
 * HOW TO DEPLOY:
 * 1. Go to Google Sheets, create a new spreadsheet named "Té Daniel RSVP"
 * 2. Set the following column headers in Row 1:
 *    A: Timestamp | B: Nombre | C: Teléfono | D: Correo | E: Asistencia
 *    F: Adultos | G: Niños > 10 | H: Niños (5-10) | I: Niños (< 5) | J: Aporte
 * 3. Go to "Extensions > Apps Script"
 * 4. Paste this code. Click "Deploy" > "New deployment" > "Web app"
 * 5. Execute as "Me", Who has access: "Anyone", DEPLOY and COPY URL.
 * 6. Paste URL into js/rsvp.js replacing 'REPLACE_ME'.
 */

// Recipients for email notifications
var EMAIL_RECIPIENTS = ['mcortes777@gmail.com', 'cindycs-07@hotmail.com', 'cindychavarrias07@gmail.com'];

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Hoja 1');
  try {
    var p = e.parameter;

    // Anti-spam honeypot
    if (p.honeypot) {
      return ContentService.createTextOutput("spam").setMimeType(ContentService.MimeType.TEXT);
    }

    var now = new Date();
    var attendance = p.attendance === 'yes' ? 'Sí' : 'No';

    // Build data for sheets
    var adultsInfo = '';
    var kidsOlderInfo = '';
    var kidsMidInfo = '';
    var kidsYoungInfo = '';
    var totalStr = '';

    if (p.attendance === 'yes') {
      adultsInfo = (p.adults_count || '0') + ' (' + (p.names_concat_adults || '') + ')';
      kidsOlderInfo = (p.kids_older_count || '0') + ' (' + (p.names_concat_kids_older || '') + ')';
      kidsMidInfo = (p.kids_mid_count || '0') + ' (' + (p.names_concat_kids_mid || '') + ')';
      kidsYoungInfo = (p.kids_young_count || '0') + ' (' + (p.names_concat_kids_young || '') + ')';
      totalStr = '₡' + (p.total || '0');
    }

    // 1. Save to Google Sheets
    var row = [
      now,
      p.name || '',
      p.phone || '',
      p.email || '',
      attendance,
      adultsInfo,
      kidsOlderInfo,
      kidsMidInfo,
      kidsYoungInfo,
      totalStr
    ];
    sheet.appendRow(row);

    // 2. Send email notification to organizers
    sendNotificationEmail(p, now, attendance);

    // 3. Send confirmation email to the guest (isolated — must not break main flow)
    try {
      sendGuestConfirmationEmail(p, now, attendance);
    } catch (guestErr) {
      Logger.log('WARN GUEST EMAIL FAILED (isolated): ' + guestErr.toString());
      Logger.log('WARN Stack: ' + (guestErr.stack || 'none'));
    }

    return ContentService.createTextOutput("success").setMimeType(ContentService.MimeType.TEXT);

  } catch (err) {
    // Log error for debugging
    Logger.log('Error in doPost: ' + err.toString());
    return ContentService.createTextOutput("error").setMimeType(ContentService.MimeType.TEXT);
  }
}

// =========================================================================
// ORGANIZER NOTIFICATION EMAIL
// =========================================================================

/**
 * Sends a formatted email notification with RSVP details to organizers.
 */
function sendNotificationEmail(p, timestamp, attendance) {
  var subject = 'Nuevo RSVP - Te de Daniel';

  // Format date
  var dateStr = Utilities.formatDate(timestamp, 'America/Costa_Rica', 'dd/MM/yyyy HH:mm');

  // Build HTML email body
  var html = '';
  html += '<div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #FCFBF9; border: 1px solid #E9D4BC; border-radius: 12px;">';

  // Header
  html += '<div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #E9D4BC; margin-bottom: 20px;">';
  html += '<h1 style="color: #5F4331; font-size: 24px; margin: 0;">Nuevo RSVP Recibido</h1>';
  html += '<p style="color: #7B593F; font-size: 14px; margin: 8px 0 0;">Te de Daniel - Baby Shower</p>';
  html += '</div>';

  // Timestamp
  html += '<p style="color: #999; font-size: 12px; margin-bottom: 16px;">Recibido: ' + dateStr + '</p>';

  // Contact info section
  html += '<table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">';
  html += makeRow('Nombre completo', p.name || '—');
  html += makeRow('Telefono', p.phone || '—');
  html += makeRow('Correo', p.email || '—');
  html += makeRow('Asistencia', attendance === 'Sí' ? 'Si asistira' : 'No asistira');
  html += '</table>';

  // Attendee details (only if attending)
  if (p.attendance === 'yes') {
    html += '<div style="background: #fff; border: 1px solid #E9D4BC; border-radius: 8px; padding: 16px; margin-bottom: 16px;">';
    html += '<h2 style="color: #5F4331; font-size: 16px; margin: 0 0 12px; border-bottom: 1px solid #E9D4BC; padding-bottom: 8px;">Detalle de Asistentes</h2>';
    html += '<table style="width: 100%; border-collapse: collapse;">';

    // Adults
    var adultsCount = p.adults_count || '0';
    var adultsNames = p.names_concat_adults || '';
    html += makeDetailRow('Adultos', adultsCount, adultsNames, 'CRC 14.000 c/u');

    // Kids > 10
    var kidsOlderCount = p.kids_older_count || '0';
    var kidsOlderNames = p.names_concat_kids_older || '';
    html += makeDetailRow('Ninos (> 10 anos)', kidsOlderCount, kidsOlderNames, 'CRC 14.000 c/u');

    // Kids 5-10
    var kidsMidCount = p.kids_mid_count || '0';
    var kidsMidNames = p.names_concat_kids_mid || '';
    html += makeDetailRow('Ninos (5 a 10)', kidsMidCount, kidsMidNames, 'CRC 7.000 c/u');

    // Kids < 5
    var kidsYoungCount = p.kids_young_count || '0';
    var kidsYoungNames = p.names_concat_kids_young || '';
    html += makeDetailRow('Ninos (< 5 anos)', kidsYoungCount, kidsYoungNames, 'Sin costo');

    html += '</table>';
    html += '</div>';

    // Total
    html += '<div style="background: #5F4331; color: #FCFBF9; border-radius: 8px; padding: 16px; text-align: center;">';
    html += '<p style="margin: 0; font-size: 14px; opacity: 0.85;">Costo total estimado</p>';
    html += '<p style="margin: 4px 0 0; font-size: 28px; font-weight: bold;">CRC ' + formatNumber(p.total || '0') + '</p>';
    html += '</div>';
  }

  // Footer
  html += '<p style="color: #aaa; font-size: 11px; text-align: center; margin-top: 20px;">Este correo fue generado automaticamente desde el formulario RSVP de tedaniel.minorcortes.com</p>';
  html += '</div>';

  // Send to all recipients
  EMAIL_RECIPIENTS.forEach(function (email) {
    try {
      MailApp.sendEmail({
        to: email,
        subject: subject,
        htmlBody: html
      });
    } catch (mailErr) {
      Logger.log('Error sending email to ' + email + ': ' + mailErr.toString());
    }
  });
}

// =========================================================================
// GUEST CONFIRMATION EMAIL
// =========================================================================

/**
 * Event constants for the guest email and calendar link.
 */
var EVENT_INFO = {
  title: 'Te de Daniel - Baby Shower',
  date: '2026-05-23',
  startTime: '17:00',
  endTime: '21:00',
  location: 'Salon de Eventos La Cabana, Tuetal Norte, Calle Loria, Alajuela, Costa Rica',
  wazeLink: 'https://waze.com/ul/hd1u15s1u3',
  googleMapsLink: 'https://www.google.co.cr/maps/place/Centro+de+Eventos+La+Caba%C3%B1a/@10.0426578,-84.221546,17z/data=!3m1!4b1!4m6!3m5!1s0x8fa0f7a7fc00d109:0xcdf87294fcfafeee!8m2!3d10.0426525!4d-84.2189711!16s%2Fg%2F11w5bj2kb0?entry=ttu&g_ep=EgoyMDI2MDMyNC4wIKXMDSoASAFQAw%3D%3D'
};

/**
 * Sends a confirmation email to the guest who filled the form.
 * Adapts content based on whether they confirmed yes or no.
 * Includes diagnostic logging and failure alerts.
 */
function sendGuestConfirmationEmail(p, timestamp, attendance) {
  Logger.log('=== GUEST EMAIL: START ===');

  // --- 1. Read and sanitize all values ---
  var guestEmail = String(p.email || '').trim();
  var guestFullName = String(p.name || '').trim();
  var attendanceRaw = String(p.attendance || '').trim();

  Logger.log('DIAG email: [' + guestEmail + ']');
  Logger.log('DIAG name: [' + guestFullName + ']');
  Logger.log('DIAG attendance: [' + attendanceRaw + ']');

  // --- 2. Validate email ---
  if (!guestEmail || guestEmail.indexOf('@') === -1 || guestEmail.indexOf('.') === -1) {
    Logger.log('SKIP: Guest email invalid or missing.');
    return;
  }
  Logger.log('OK: Email validation passed');

  // --- 3. Check quota ---
  var quota = MailApp.getRemainingDailyQuota();
  Logger.log('DIAG quota remaining: ' + quota);
  if (quota < 1) {
    Logger.log('FAIL: No MailApp quota remaining. Cannot send guest email.');
    return;
  }

  // --- 4. Prepare variables ---
  var guestName = guestFullName ? guestFullName.split(' ')[0] : 'Estimado/a';
  var isAttending = (attendanceRaw === 'yes');
  var subject = 'Confirmacion de asistencia - Te de Daniel';

  // --- 5. Build HTML email (using array for clean construction) ---
  var h = [];

  h.push('<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;background:#FCFBF9;border-radius:16px;overflow:hidden;border:1px solid #E9D4BC;">');

  // Header banner
  h.push('<div style="background:linear-gradient(135deg,#5F4331,#7B593F);padding:32px 24px;text-align:center;">');
  h.push('<p style="color:rgba(252,251,249,0.7);font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Baby Shower</p>');
  h.push('<h1 style="color:#FCFBF9;font-size:28px;font-weight:300;margin:0;">Te de Daniel</h1>');
  h.push('</div>');

  // Body
  h.push('<div style="padding:32px 28px;">');

  if (isAttending) {
    h.push('<h2 style="color:#5F4331;font-size:20px;margin:0 0 12px;">Hola, ' + guestName + '!</h2>');
    h.push('<p style="color:#7B593F;font-size:15px;line-height:1.65;margin:0 0 24px;">');
    h.push('Hemos recibido tu confirmacion de asistencia. Que alegria saber que nos acompanaras en este dia tan especial. ');
    h.push('A continuacion encontraras un resumen de tu registro.');
    h.push('</p>');

    // Attendee summary card
    h.push('<div style="background:#fff;border:1px solid #E9D4BC;border-radius:12px;padding:20px;margin-bottom:20px;">');
    h.push('<h3 style="color:#5F4331;font-size:14px;text-transform:uppercase;letter-spacing:1px;margin:0 0 14px;padding-bottom:10px;border-bottom:1px solid #f0ebe5;">Resumen de Asistentes</h3>');
    h.push('<table style="width:100%;border-collapse:collapse;">');

    var ac = String(p.adults_count || '0');
    var an = String(p.names_concat_adults || '');
    if (parseInt(ac) > 0) h.push(makeGuestRow('Adultos', ac, an));

    var koc = String(p.kids_older_count || '0');
    var kon = String(p.names_concat_kids_older || '');
    if (parseInt(koc) > 0) h.push(makeGuestRow('Ninos (mayores de 10)', koc, kon));

    var kmc = String(p.kids_mid_count || '0');
    var kmn = String(p.names_concat_kids_mid || '');
    if (parseInt(kmc) > 0) h.push(makeGuestRow('Ninos (5 a 10)', kmc, kmn));

    var kyc = String(p.kids_young_count || '0');
    var kyn = String(p.names_concat_kids_young || '');
    if (parseInt(kyc) > 0) h.push(makeGuestRow('Ninos (menores de 5)', kyc, kyn));

    h.push('</table>');
    h.push('</div>');

    // Total
    h.push('<div style="background:linear-gradient(135deg,#5F4331,#3D2B1F);color:#FCFBF9;border-radius:12px;padding:18px 24px;text-align:center;margin-bottom:24px;">');
    h.push('<p style="margin:0;font-size:13px;opacity:0.8;">Costo total estimado</p>');
    h.push('<p style="margin:4px 0 0;font-size:28px;font-weight:700;">CRC ' + formatNumber(p.total || '0') + '</p>');
    h.push('</div>');

  } else {
    h.push('<h2 style="color:#5F4331;font-size:20px;margin:0 0 12px;">Hola, ' + guestName + '</h2>');
    h.push('<p style="color:#7B593F;font-size:15px;line-height:1.65;margin:0 0 24px;">');
    h.push('Hemos recibido tu respuesta. Lamentamos que no puedas acompanarnos, pero agradecemos mucho que te hayas tomado el tiempo de confirmar.');
    h.push('</p>');
  }

  // Event details (always)
  h.push('<div style="background:#fff;border:1px solid #E9D4BC;border-radius:12px;padding:20px;margin-bottom:20px;">');
  h.push('<h3 style="color:#5F4331;font-size:14px;text-transform:uppercase;letter-spacing:1px;margin:0 0 14px;padding-bottom:10px;border-bottom:1px solid #f0ebe5;">Detalles del Evento</h3>');
  h.push('<table style="width:100%;border-collapse:collapse;">');
  h.push(makeRow('Fecha', 'Sabado 23 de mayo, 2026'));
  h.push(makeRow('Hora', '5:00 p.m.'));
  h.push(makeRow('Lugar', 'Salon de Eventos La Cabana'));
  h.push(makeRow('Direccion', 'Tuetal Norte, Calle Loria, Alajuela, Costa Rica'));
  h.push('</table>');
  h.push('</div>');

  // Map links
  h.push('<div style="text-align:center;margin-bottom:20px;">');
  h.push('<p style="color:#7B593F;font-size:13px;margin:0 0 12px;">Como llegar?</p>');
  h.push('<a href="' + EVENT_INFO.wazeLink + '" target="_blank" style="display:inline-block;padding:10px 24px;background:#33CCFF;color:#fff;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;margin:0 6px 8px;">Abrir en Waze</a>');
  h.push('<a href="' + EVENT_INFO.googleMapsLink + '" target="_blank" style="display:inline-block;padding:10px 24px;background:#4285F4;color:#fff;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;margin:0 6px 8px;">Abrir en Google Maps</a>');
  h.push('</div>');

  // Calendar
  var calUrl = buildGoogleCalendarUrl();
  h.push('<div style="text-align:center;margin-bottom:24px;">');
  h.push('<a href="' + calUrl + '" target="_blank" style="display:inline-block;padding:10px 28px;background:#fff;color:#5F4331;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;border:1.5px solid #D8B38A;">Agregar a Google Calendar</a>');
  h.push('</div>');

  // Footer
  h.push('<div style="border-top:1px solid #E9D4BC;padding-top:16px;text-align:center;">');
  h.push('<p style="color:#aaa;font-size:11px;margin:0;">Este correo fue generado automaticamente.</p>');
  h.push('<p style="color:#aaa;font-size:11px;margin:4px 0 0;">Te de Daniel - tedaniel.minorcortes.com</p>');
  h.push('</div>');

  h.push('</div>'); // body padding
  h.push('</div>'); // wrapper

  var htmlBody = h.join('');

  // --- 6. Build plain text fallback (real newlines via array join) ---
  var lines = ['Confirmacion de asistencia - Te de Daniel', ''];
  if (isAttending) {
    lines.push('Hola ' + guestName + ', tu asistencia ha sido confirmada.');
    lines.push('Fecha: Sabado 23 de mayo, 2026');
    lines.push('Hora: 5:00 p.m.');
    lines.push('Lugar: Salon de Eventos La Cabana, Tuetal Norte, Alajuela');
  } else {
    lines.push('Hola ' + guestName + ', hemos registrado que no podras asistir. Gracias por confirmar.');
  }
  var plainBody = lines.join('\n');

  Logger.log('DIAG: HTML length = ' + htmlBody.length);
  Logger.log('DIAG: Plain text length = ' + plainBody.length);
  Logger.log('DIAG: About to call MailApp.sendEmail to: ' + guestEmail);

  // --- 7. Send to guest ---
  try {
    MailApp.sendEmail({
      to: guestEmail,
      subject: subject,
      body: plainBody,
      htmlBody: htmlBody
    });
    Logger.log('OK: Guest email SENT to: ' + guestEmail);
  } catch (mailErr) {
    Logger.log('FAIL: MailApp.sendEmail error: ' + mailErr.toString());
    Logger.log('FAIL: Stack: ' + (mailErr.stack || 'no stack'));

    // Alert organizers about the failure
    try {
      MailApp.sendEmail({
        to: EMAIL_RECIPIENTS[0],
        subject: 'ALERTA: Fallo correo invitado RSVP',
        body: 'El correo de confirmacion al invitado fallo.\n\nEmail destino: ' + guestEmail + '\nNombre: ' + guestFullName + '\nError: ' + mailErr.toString()
      });
      Logger.log('OK: Alert sent to organizer about guest email failure.');
    } catch (alertErr) {
      Logger.log('FAIL: Could not send alert either: ' + alertErr.toString());
    }
  }

  // --- 8. DIAGNOSTIC: Send copy to first organizer for verification ---
  // TODO: Remove this block once guest emails are confirmed working
  try {
    MailApp.sendEmail({
      to: EMAIL_RECIPIENTS[0],
      subject: '[DIAG] Copia correo invitado - ' + guestEmail,
      body: plainBody,
      htmlBody: htmlBody
    });
    Logger.log('OK: Diagnostic copy sent to organizer.');
  } catch (diagErr) {
    Logger.log('FAIL: Diagnostic copy failed: ' + diagErr.toString());
  }

  Logger.log('=== GUEST EMAIL: END ===');
}

/**
 * Builds a Google Calendar "Add Event" URL.
 */
function buildGoogleCalendarUrl() {
  // Event: May 23, 2026 5:00 PM - 9:00 PM Costa Rica (UTC-6)
  var startUtc = '20260523T230000Z'; // 17:00 CR = 23:00 UTC
  var endUtc = '20260524T030000Z'; // 21:00 CR = 03:00 UTC next day

  var params = [
    'action=TEMPLATE',
    'text=' + encodeURIComponent('Te de Daniel - Baby Shower'),
    'dates=' + startUtc + '/' + endUtc,
    'details=' + encodeURIComponent('Baby shower de Daniel.\nSalon de Eventos La Cabana\nTuetal Norte, Calle Loria, Alajuela, Costa Rica\n\nWaze: https://waze.com/ul/hd1u15s1u3'),
    'location=' + encodeURIComponent('Salon de Eventos La Cabana, Tuetal Norte, Calle Loria, Alajuela, Costa Rica')
  ];

  return 'https://calendar.google.com/calendar/render?' + params.join('&');
}

// =========================================================================
// SHARED HELPERS
// =========================================================================

/**
 * Creates a simple info row for the email table.
 */
function makeRow(label, value) {
  return '<tr>' +
    '<td style="padding: 8px 12px; font-size: 13px; color: #7B593F; font-weight: bold; width: 140px; vertical-align: top;">' + label + '</td>' +
    '<td style="padding: 8px 12px; font-size: 14px; color: #5F4331;">' + value + '</td>' +
    '</tr>';
}

/**
 * Creates a detail row for organizer email (category with price).
 */
function makeDetailRow(category, count, names, price) {
  var namesDisplay = names ? names : '—';
  return '<tr style="border-bottom: 1px solid #f0ebe5;">' +
    '<td style="padding: 10px 0; vertical-align: top;">' +
    '<strong style="color: #5F4331; font-size: 14px;">' + category + '</strong><br>' +
    '<span style="color: #999; font-size: 12px;">' + price + '</span>' +
    '</td>' +
    '<td style="padding: 10px 0; text-align: right; vertical-align: top;">' +
    '<strong style="color: #5F4331; font-size: 16px;">' + count + '</strong><br>' +
    '<span style="color: #7B593F; font-size: 12px;">' + namesDisplay + '</span>' +
    '</td>' +
    '</tr>';
}

/**
 * Creates a guest-facing attendee row (no prices shown).
 */
function makeGuestRow(category, count, names) {
  var namesDisplay = names ? names : '';
  return '<tr style="border-bottom: 1px solid #f0ebe5;">' +
    '<td style="padding: 8px 0; vertical-align: top;">' +
    '<span style="color: #5F4331; font-size: 14px; font-weight: 600;">' + category + '</span>' +
    (namesDisplay ? '<br><span style="color: #7B593F; font-size: 12px;">' + namesDisplay + '</span>' : '') +
    '</td>' +
    '<td style="padding: 8px 0; text-align: right; vertical-align: middle;">' +
    '<span style="color: #5F4331; font-size: 18px; font-weight: 700;">' + count + '</span>' +
    '</td>' +
    '</tr>';
}

/**
 * Formats a number with dot thousands separator (Costa Rica style).
 */
function formatNumber(numStr) {
  var n = parseInt(numStr) || 0;
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
