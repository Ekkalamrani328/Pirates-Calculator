// Matrix background
(function () {
  const canvas = document.getElementById("matrix");
  const ctx = canvas.getContext("2d");
  let W = (canvas.width = window.innerWidth);
  let H = (canvas.height = window.innerHeight);
  const size = Math.max(10, Math.floor(Math.min(W, H) / 60));
  const columns = Math.floor(W / size);
  const drops = new Array(columns).fill(0);
  const letters = "01";

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);

  function draw() {
    ctx.fillStyle = "rgba(0,0,0,0.06)";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#00ff66";
    ctx.font = `${size}px monospace`;
    for (let i = 0; i < drops.length; i++) {
      const text = letters.charAt(Math.floor(Math.random() * letters.length));
      ctx.fillText(text, i * size, drops[i] * size);
      if (drops[i] * size > H && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// NPC Preset
document.getElementById("npcPreset").addEventListener("change", function () {
  const [hp, pearl, gold] = this.value.split(",").map(Number);
  if (!hp) return;
  document.getElementById("hp").value = hp;
  if (pearl) document.getElementById("pearl").value = pearl;
  if (gold) document.getElementById("gold").value = gold;
});

// Format detik ke jam/menit/detik
function formatSeconds(s) {
  s = Math.floor(s);
  const h = Math.floor(s / 3600); s -= h * 3600;
  const m = Math.floor(s / 60); s -= m * 60;
  if (h > 0) return `${h} jam ${m} menit ${s} detik`;
  if (m > 0) return `${m} menit ${s} detik`;
  return `${s} detik`;
}

// Hitung
function calculate() {
  const hp = Number(document.getElementById("hp").value) || 0;
  const pearl = Number(document.getElementById("pearl").value) || 0;
  const gold = Number(document.getElementById("gold").value) || 0;
  const damage = Number(document.getElementById("damage").value) || 1;
  const ammoPerShot = Number(document.getElementById("ammoPerShot").value) || 1;
  const totalAmmo = Number(document.getElementById("totalAmmo").value) || 0;
  const tempo = Number(document.getElementById("tempo").value) || 1;
  const hours = Number(document.getElementById("hours").value) || 0;

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

  document.getElementById("output").textContent = `
📌 NPC
HP NPC              : ${hp.toLocaleString()}
Reward per NPC      : ${pearl.toLocaleString()} Pearl, ${gold.toLocaleString()} Gold

⚔️ Pertempuran
Tembakan dibutuhkan  : ${shotsPerNpc} kali
Ammo per NPC         : ${ammoPerNpc.toLocaleString()} ammo
Waktu per NPC        : ${formatSeconds(secondsPerKill)}

📊 Total
NPC terbunuh         : ${totalNpc.toLocaleString()}
Pearl diperoleh      : ${totalPearl.toLocaleString()}
Gold diperoleh       : ${totalGold.toLocaleString()}
Ammo terpakai        : ${totalAmmoUsed.toLocaleString()}

${note}
  `;
}
