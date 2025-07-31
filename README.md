# Discord Role Bot (5 Dropdown Categories)

Bot Discord untuk memilih role lewat **5 dropdown**:
1. Weather
2. Seed
3. Gear
4. Traveling Merchant
5. Event

## 🔧 Cara jalan di Windows (PowerShell)

1. Pastikan Node.js sudah terinstall (versi 18+).
2. Buat file `.env` (lihat contoh di `.env.example`) dan isi:
```
DISCORD_TOKEN=TOKEN_BOT_KAMU
CHANNEL_ID=ID_CHANNEL_TUJUAN
```
3. Install dependency:
```
npm install
```
4. Jalankan bot:
```
npm start
```
Jika berhasil, bot akan menulis:
```
🌐 Web server aktif untuk anti-sleep
✅ Bot aktif sebagai <nama-bot>
✅ Dropdown sudah dikirim ke channel!
```

## ☁️ Deploy gratis tanpa kartu (Cyclic.sh)

1. Upload project ke GitHub (tanpa `.env`).
2. Login ke https://cyclic.sh dengan GitHub → Deploy from GitHub.
3. Di **Environment Variables**, tambahkan:
   - `DISCORD_TOKEN` = token bot
   - `CHANNEL_ID` = ID channel
4. Selesai, bot online 24/7.

## 📄 Catatan
- Pastikan role **sudah dibuat** di server dan **namanya sama persis** dengan `roleName` pada script.
- Bot harus punya izin **Manage Roles** dan posisinya **di atas** role yang mau ditambahkan.
- Tiap restart bot akan mengirim ulang dropdown; hapus yang lama kalau perlu.
