// js/rsvp.js
/*
  RSVP Logic
  Handles dynamic names generation, real-time cost calculation, and submission to Google Apps Script.
*/

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwrCPWXbcGwlFHZ1_YmoSnFBdQ2MfPUYhjv8eCE1W6FHkDMxy3dHrKoIhcw1zBAJvwowA/exec'; // User will replace this with their Google Apps Script Web App URL

const PRICES = {
  adults: 14000,
  kids_older: 14000,
  kids_mid: 7000,
  kids_young: 0
};

// Elements
const form = document.getElementById('rsvp-form');
const radioYes = document.querySelector('input[name="attendance"][value="yes"]');
const radioNo = document.querySelector('input[name="attendance"][value="no"]');
const rsvpQuantities = document.getElementById('rsvp-quantities');
const totalLabel = document.getElementById('rsvp-total');
const hiddenTotal = document.getElementById('total-hidden');
const btnSubmit = document.getElementById('btn-submit');
const statusMsg = document.getElementById('rsvp-status');
const successMsg = document.getElementById('rsvp-success');

// Init logic
function initRSVP() {
  if (!form) return;

  // Toggle quantities section based on attendance
  const updateVisibility = () => {
    const paymentNote = document.getElementById('rsvp-payment-note');
    if (radioYes.checked) {
      rsvpQuantities.classList.remove('hidden');
      if (paymentNote) paymentNote.classList.remove('hidden');
    } else {
      rsvpQuantities.classList.add('hidden');
      if (paymentNote) paymentNote.classList.add('hidden');
      resetQuantities();
    }
  };

  if (radioYes && radioNo) {
    radioYes.addEventListener('change', updateVisibility);
    radioNo.addEventListener('change', updateVisibility);
  }

  // Bind plus/minus buttons
  document.querySelectorAll('.btn-qty').forEach(btn => {
    btn.addEventListener('click', handleQtyChange);
  });

  // Handle form submission
  form.addEventListener('submit', handleSubmit);
}

// Qty Change
function handleQtyChange(e) {
  const isPlus = e.target.classList.contains('btn-plus');
  const section = e.target.closest('.qty-section');
  const input = section.querySelector('.qty-input');
  const cat = section.dataset.cat;

  let val = parseInt(input.value) || 0;
  if (isPlus && val < 8) {
    val++;
  } else if (!isPlus && val > 0) {
    val--;
  }

  input.value = val;
  updateNamesList(section, cat, val);
  calculateTotal();
}

// Dynamically generate name inputs
function updateNamesList(section, cat, count) {
  const container = section.querySelector('.names-container');
  const currentCount = container.children.length;

  if (count > currentCount) {
    // Add fields
    for (let i = currentCount; i < count; i++) {
      const p = getCatLabel(cat);
      const div = document.createElement('div');
      div.className = 'input-wrapper name-input-row';
      div.innerHTML = `<input type="text" name="name_${cat}[]" class="form-input" required placeholder="Nombre: ${p} ${i + 1}">`;
      container.appendChild(div);
    }
  } else if (count < currentCount) {
    // Remove fields
    for (let i = currentCount - 1; i >= count; i--) {
      container.removeChild(container.lastChild);
    }
  }
}

function getCatLabel(cat) {
  switch (cat) {
    case 'adults': return 'Adulto';
    case 'kids_older': return 'Niño/a (>10)';
    case 'kids_mid': return 'Niño/a (5-10)';
    case 'kids_young': return 'Niño/a (<5)';
    default: return 'Persona';
  }
}

function calculateTotal() {
  let total = 0;
  document.querySelectorAll('.qty-section').forEach(section => {
    const cat = section.dataset.cat;
    const val = parseInt(section.querySelector('.qty-input').value) || 0;
    total += val * PRICES[cat];
  });

  hiddenTotal.value = total;
  // Format as currency
  totalLabel.textContent = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 0 }).format(total);
}

function resetQuantities() {
  document.querySelectorAll('.qty-input').forEach(input => input.value = 0);
  document.querySelectorAll('.names-container').forEach(c => c.innerHTML = '');
  calculateTotal();
}

// Submission
async function handleSubmit(e) {
  e.preventDefault();
  statusMsg.classList.add('hidden');

  // Anti-spam check (honeypot)
  if (document.getElementById('honeypot').value) {
    console.log("Spam detected");
    return; // silently abort
  }

  // Set timestamp (time fill verification)
  document.getElementById('timestamp').value = new Date().toISOString();

  // Validate quantities if attending
  if (radioYes.checked) {
    const totalPeople = Array.from(document.querySelectorAll('.qty-input')).reduce((sum, input) => sum + parseInt(input.value || 0), 0);
    if (totalPeople === 0) {
      statusMsg.textContent = 'Por favor, indique al menos un asistente en las cantidades.';
      statusMsg.classList.remove('hidden');
      return;
    }
  }

  // Collect data
  btnSubmit.classList.add('loading');
  btnSubmit.disabled = true;

  try {
    const formData = new FormData(form);

    // Group dynamically generated names into arrays or comma-separated strings
    // We append them manually to formData for GAS to parse properly
    ['adults', 'kids_older', 'kids_mid', 'kids_young'].forEach(cat => {
      const inputs = form.querySelectorAll(`input[name="name_${cat}[]"]`);
      const names = Array.from(inputs).map(inp => inp.value).join(', ');
      formData.append(`names_concat_${cat}`, names);
    });

    if (SCRIPT_URL === 'REPLACE_ME') {
      // Demo mode if script URL is not set
      console.log('Mode: DEMO');
      await new Promise(r => setTimeout(r, 1500));
      showSuccess();
      return;
    }

    // Call Apps Script (uses standard no-cors mode to bypass CORS preflight required by GAS POSTs, though it makes response opaque. Better: fetch without no-cors if you return proper headers or JSONP, but FormData directly to GAS usually works well if Apps Script allows it, or uses fetch GET to avoid preflight issues).

    // Standard approach for Apps Script Web App without CORS pain:
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: formData,
    });

    if (response.ok || response.type === 'opaque') {
      // opaque means 'no-cors' hit, assuming success for now 
      showSuccess();
    } else {
      throw new Error('Network response was not ok.');
    }

  } catch (error) {
    console.error('Error submitting form:', error);
    statusMsg.textContent = 'Hubo un error al enviar su confirmación. Por favor intente más tarde o contáctenos.';
    statusMsg.classList.remove('hidden');
  } finally {
    btnSubmit.classList.remove('loading');
    btnSubmit.disabled = false;
  }
}

function showSuccess() {
  form.style.display = 'none';
  const intro = document.querySelector('.rsvp-intro');
  if (intro) intro.style.display = 'none';
  const success = document.getElementById('rsvp-success');
  if (success) {
    success.classList.remove('hidden');
    // Scroll to success message after DOM renders
    setTimeout(function() {
      var headerOffset = 80;
      var elementPosition = success.getBoundingClientRect().top;
      var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }, 100);
  }
}

document.addEventListener('DOMContentLoaded', initRSVP);
