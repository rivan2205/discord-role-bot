const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Bot Aktif!'));
app.listen(3000, () => console.log('🌐 Web server aktif untuk anti-sleep'));

const { 
  Client, 
  GatewayIntentBits, 
  ActionRowBuilder, 
  StringSelectMenuBuilder, 
  StringSelectMenuOptionBuilder,
  Events,
  Partials 
} = require('discord.js');
require('dotenv').config();

const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error('❌ DISCORD_TOKEN tidak terbaca! Pastikan variable sudah di-set di Railway.');
} else {
  console.log('ℹ️ Token terbaca dengan panjang:', token.length, '(***' + token.slice(-5) + ')');
}

const channelId = process.env.CHANNEL_ID;
if (!channelId) {
  console.error('❌ CHANNEL_ID tidak terbaca! Pastikan variable sudah di-set di Railway.');
}

// Data roles contoh
const weatherRoles = [{ label: "🌧️ Rain", roleName: "Rain" }];
const seedRoles = [];
const gearRoles = [];
const merchantRoles = [{ label: "🧙‍♂️ Traveling Merchant", roleName: "traveling merchant" }];
const eventRoles = [{ label: "🎉 Event Ping", roleName: "event" }];

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
    await channel.send({ content: '**Bot aktif! Pilih role di dropdown.**' });
    console.log('✅ Dropdown dikirim ke channel!');
  } catch (e) {
    console.error('❌ Error fetch channel:', e.message);
  }
});

client.login(token).catch(e => console.error('❌ Gagal login bot:', e.message));
