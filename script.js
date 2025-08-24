const SHEET_ID = "1MpbHvg3T6gLetHKB-x4X4o1JWPZf74Rb3fa62RZ7CZc"; // Google Sheet ID
const API_KEY = "AIzaSyBl3BqjTc4iHMFUOtCl-s-qgeNEgaUTlcA";  // Sheets API key
const RANGE = "History!A:D"; // Timestamp, Sender, MessageID, Image ID

async function loadLeaderboard() {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.values || data.values.length < 2) return;

    const rows = data.values.slice(1); // skip header
    rows.sort((a,b) => new Date(b[0]) - new Date(a[0])); // newest first

    const gallery = document.getElementById("gallery");
    rows.forEach(row => {
      const [timestamp, sender, messageId, imageId] = row;
      if (!imageId) return;

      // Apply name rule: first 16 chars, remove quotes
      let displayName = sender ? sender.slice(0, 16).replace(/"/g, '') : 'Unknown';

      // Google Drive thumbnail URL
      const imgUrl = `https://drive.google.com/thumbnail?id=${imageId}&sz=w1000`;

      // Create gallery card
      const div = document.createElement("div");
      div.className = "item";
      div.innerHTML = `
        <img src="${imgUrl}" alt="Poop Image">
        <div class="info">
          <strong>${displayName}</strong>
          ${new Date(timestamp).toLocaleString()}<br>
          ID: ${messageId}
        </div>
      `;
      gallery.appendChild(div);
    });
  } catch(err) {
    console.error("Failed to load leaderboard:", err);
  }
}

window.addEventListener("DOMContentLoaded", loadLeaderboard);
