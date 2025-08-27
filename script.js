// =====================
// MATRIX BACKGROUND
// =====================
(function () {
  const canvas = document.getElementById("matrix");
  const ctx = canvas.getContext("2d");
  let W, H, size, columns, drops;
  const letters = "01";
  const dpr = window.devicePixelRatio || 1;

  function resize() {
    W = canvas.width = window.innerWidth * dpr;
    H = canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
    size = Math.max(12, Math.floor(Math.min(W / dpr, H / dpr) / 60));
    columns = Math.floor(W / dpr / size);
    drops = new Array(columns).fill(0);
  }

  function draw() {
    ctx.fillStyle = "rgba(0,0,0,0.06)";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#00ff66";
    ctx.font = `${size}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = letters.charAt(Math.floor(Math.random() * letters.length));
      ctx.fillText(text, i * size, drops[i] * size);
      if (drops[i] * size > H / dpr && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  draw();
})();

// =====================
// NPC PRESET
// =====================
document.getElementById("npcPreset")?.addEventListener("change", function () {
  const [hp, pearl, gold] = (this.value || "")
    .split(",")
    .map(v => Number(v) || 0);

  if (hp) document.getElementById("hp").value = hp;
  if (pearl) document.getElementById("pearl").value = pearl;
  if (gold) document.getElementById("gold").value = gold;
});

// =====================
// HELPER: Format Detik
// =====================
function formatSeconds(s) {
  s = Math.floor(s);
  const h = Math.floor(s / 3600); s %= 3600;
  const m = Math.floor(s / 60); s %= 60;

  if (h > 0) return `${h} jam ${m} menit ${s} detik`;
  if (m > 0) return `${m} menit ${s} detik`;
  return `${s} detik`;
}

// =====================
// HITUNG
// =====================
function calculate() {
  const nf = new Intl.NumberFormat("id-ID");

  const hp = Number(document.getElementById("hp").value) || 0;
  const pearl = Number(document.getElementById("pearl").value) || 0;
  const gold = Number(document.getElementById("gold").value) || 0;
  const damage = Number(document.getElementById("damage").value) || 1;
  const ammoPerShot = Number(document.getElementById("ammoPerShot").value) || 1;
  const totalAmmo = Number(document.getElementById("totalAmmo").value) || 0;
  const tempo = Number(document.getElementById("tempo").value) || 1;
  const hours = Number(document.getElementById("hours").value) || 0;

  // Perhitungan dasar
  const shotsPerNpc = Math.ceil(hp / damage);
  const ammoPerNpc = shotsPerNpc * ammoPerShot;
  const maxNpcByAmmo = ammoPerNpc > 0 ? Math.floor(totalAmmo / ammoPerNpc) : 0;

  const totalSeconds = hours * 3600;
  const secondsPerKill = shotsPerNpc * tempo;
  const maxNpcByTime = secondsPerKill > 0 ? Math.floor(totalSeconds / secondsPerKill) : 0;

  const totalNpc = Math.min(maxNpcByAmmo, maxNpcByTime);
  const totalPearl = totalNpc * pearl;
  const totalGold = totalNpc * gold;
  const totalAmmoUsed = totalNpc * ammoPerNpc;

  // Catatan keterbatasan
  let note = "";
  if (maxNpcByAmmo === 0) {
    note = "⚠️ Ammo tidak cukup untuk 1 kill.";
  } else if (maxNpcByAmmo < maxNpcByTime) {
    const secondsUsed = maxNpcByAmmo * secondsPerKill;
    note = `⚠️ Ammo habis setelah ${formatSeconds(secondsUsed)} (${maxNpcByAmmo} NPC).`;
  } else if (maxNpcByTime < maxNpcByAmmo) {
    note = `ℹ️ Waktu ${hours} jam membatasi hasil: ${maxNpcByTime} NPC.`;
  } else {
    note = `✔️ Ammo & waktu seimbang.`;
  }

  // Catatan efisiensi
  let efficiencyNote = "";
  if (ammoPerNpc > (pearl + gold)) {
    efficiencyNote = "⚠️ Ammo boros dibanding reward.";
  } else if (ammoPerNpc < (pearl + gold) / 2) {
    efficiencyNote = "💡 Efisien: reward besar dibanding ammo.";
  } else {
    efficiencyNote = "➖ Seimbang antara ammo & reward.";
  }

  // Output
  document.getElementById("output").textContent = `
📌 NPC
HP NPC              : ${nf.format(hp)}
Reward per NPC      : ${nf.format(pearl)} Pearl, ${nf.format(gold)} Gold

⚔️ Pertempuran
Tembakan dibutuhkan  : ${nf.format(shotsPerNpc)} kali
Ammo per NPC         : ${nf.format(ammoPerNpc)} ammo
Waktu per NPC        : ${formatSeconds(secondsPerKill)}

📊 Total
NPC terbunuh         : ${nf.format(totalNpc)}
Pearl diperoleh      : ${nf.format(totalPearl)}
Gold diperoleh       : ${nf.format(totalGold)}
Ammo terpakai        : ${nf.format(totalAmmoUsed)}

${note}
${efficiencyNote}
  `;
}

