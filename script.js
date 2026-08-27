// GANTI DENGAN URL WEB APP GOOGLE APPS SCRIPT ANDA (DEPLOYMENT EXECUTABLE URL)
const GAS_URL = "https://script.google.com/macros/library/d/17MEgXCYzTQQK7sWj0xAKM-0O7b_P-sIfKBmci8n5DShHIac9ffqt_nXW/66";

document.getElementById('careerForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const btn = document.getElementById('btnSubmit');
  const btnText = document.getElementById('btnText');
  const spinner = document.getElementById('loadingSpinner');
  const statusAlert = document.getElementById('statusAlert');
  const statusText = document.getElementById('statusText');
  const statusIcon = document.getElementById('statusIcon');

  // Lock UI / Set Loading State
  btn.disabled = true;
  btnText.innerText = "Memproses AI & Membentuk PDF...";
  spinner.classList.remove('hidden');

  // Reset Alert
  statusAlert.classList.add('hidden');
  statusAlert.className = "mt-6 p-4 rounded-xl border text-sm flex items-center gap-3";

  // Form Payload
  const payload = {
    nama: document.getElementById('nama').value.trim(),
    prodi: document.getElementById('prodi').value.trim(),
    prestasi: document.getElementById('prestasi').value.trim(),
    karir: document.getElementById('karir').value.trim(),
    keinginan: document.getElementById('keinginan').value.trim()
  };

  try {
    // Trik CORS Preflight Bypass: Menggunakan 'text/plain'
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.success) {
      // Tampilkan UI Sukses
      statusAlert.classList.add('bg-emerald-500/10', 'border-emerald-500/30', 'text-emerald-400');
      statusIcon.innerHTML = `<svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`;
      statusText.innerText = `Berhasil! Mengunduh dokumen ${result.fileName}...`;
      statusAlert.classList.remove('hidden');

      // Auto Download PDF dari Data Base64
      const link = document.createElement('a');
      link.href = 'data:application/pdf;base64,' + result.base64Data;
      link.download = result.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } else {
      throw new Error(result.error || "Gagal memproses data dari server.");
    }

  } catch (err) {
    // Tampilkan UI Gagal
    statusAlert.classList.add('bg-rose-500/10', 'border-rose-500/30', 'text-rose-400');
    statusIcon.innerHTML = `<svg class="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    statusText.innerText = `Error: ${err.message}`;
    statusAlert.classList.remove('hidden');

  } finally {
    // Restore UI
    btn.disabled = false;
    btnText.innerText = "Generate & Download PDF";
    spinner.classList.add('hidden');
  }
});
