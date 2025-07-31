const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Bot Aktif!'));
app.listen(3000, () => console.log('🌐 Web server aktif untuk anti-sleep'));

const { Client, GatewayIntentBits, Events, Partials } = require('discord.js');
require('dotenv').config();

// 🔹 DEBUG: tampilkan semua Environment Variables yang terbaca
console.log("🔍 Environment Variables yang terbaca:");
Object.keys(process.env).forEach(key => {
  if (key === 'DISCORD_TOKEN') {
    console.log(`- ${key}: [TOKEN TERDETEKSI]`);
  } else if (key === 'CHANNEL_ID') {
    console.log(`- ${key}: ${process.env[key]}`);
  } else {
    // tampilkan variable lain untuk debug
    console.log(`- ${key}`);
  }
});

const token = process.env.DISCORD_TOKEN;
const channelId = process.env.CHANNEL_ID;

if (!token) {
  console.error('❌ DISCORD_TOKEN tidak terbaca!');
}
if (!channelId) {
  console.error('❌ CHANNEL_ID tidak terbaca!');
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel]
});

client.once(Events.ClientReady, async () => {
  console.log(`✅ Bot aktif sebagai ${client.user.tag}`);
  try {
    const channel = await client.channels.fetch(channelId);
    if (!channel) {
      console.error('❌ Channel tidak ditemukan');
      return;
    }
    await channel.send('**Bot debug aktif!**');
    console.log('✅ Pesan debug dikirim ke channel!');
  } catch (e) {
    console.error('❌ Error fetch channel:', e.message);
  }
});

client.login(token).catch(e => console.error('❌ Gagal login bot:', e.message));
