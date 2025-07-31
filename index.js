const fs = require("fs");
const express = require("express");
const {
  Client,
  GatewayIntentBits,
  Events,
  Partials,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder
} = require("discord.js");
require("dotenv").config();

// Load ENV
const token = process.env.DISCORD_TOKEN;
const channelId = process.env.CHANNEL_ID; // dropdown
const repChannelId = process.env.REP_CHANNEL_ID; // reputasi
const trustedRoleName = process.env.TRUSTED_ROLE_NAME || "Trusted Seller";
const repFile = "data.json";

// Data reputasi
let repData = {};
if (fs.existsSync(repFile)) {
  repData = JSON.parse(fs.readFileSync(repFile));
}

// Express untuk anti-sleep
const app = express();
app.get("/", (req, res) => res.send("Bot Aktif!"));
app.listen(3000, () => console.log("🌐 Web server aktif untuk anti-sleep"));

// Client Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel]
});

// Data dropdown role
const weatherRoles = [
  { label: "🌧️ Rain", roleName: "Rain" },
  { label: "❄️ Snowing", roleName: "Snowing" },
  { label: "⛈️ Thunder", roleName: "Thunder" }
];
const seedRoles = [{ label: "🍉 Watermelon", roleName: "Watermelon" }];
const gearRoles = [{ label: "💦 Master Sprinkler", roleName: "Master Sprinkler" }];
const merchantRoles = [{ label: "🧙‍♂️ Traveling Merchant", roleName: "traveling merchant" }];
const eventRoles = [{ label: "🎉 Event Ping", roleName: "event" }];

// Simpan reputasi ke file
function saveRep() {
  fs.writeFileSync(repFile, JSON.stringify(repData, null, 2));
}

// Client ready
client.once(Events.ClientReady, async () => {
  console.log(`✅ Bot aktif sebagai ${client.user.tag}`);

  try {
    const channel = await client.channels.fetch(channelId);
    if (!channel) return console.log("❌ Channel dropdown tidak ditemukan!");

    // Kirim dropdown
    const makeDropdown = (id, placeholder, roles) => {
      const menu = new StringSelectMenuBuilder()
        .setCustomId(id)
        .setPlaceholder(placeholder)
        .setMinValues(0)
        .setMaxValues(roles.length);

      roles.forEach((role) =>
        menu.addOptions(new StringSelectMenuOptionBuilder().setLabel(role.label).setValue(role.roleName))
      );

      return new ActionRowBuilder().addComponents(menu);
    };

    await channel.send({
      content: "**Pilih role sesuai kategori:**",
      components: [
        makeDropdown("select_weather", "🌦️ Weather", weatherRoles),
        makeDropdown("select_seed", "🌱 Seed", seedRoles),
        makeDropdown("select_gear", "⚙️ Gear", gearRoles),
        makeDropdown("select_merchant", "🧙‍♂️ Merchant", merchantRoles),
        makeDropdown("select_event", "🎉 Event", eventRoles)
      ]
    });

    console.log("✅ Dropdown role terkirim!");
  } catch (err) {
    console.log("❌ Error kirim dropdown:", err.message);
  }
});

// Handle dropdown role
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;

  const roles = {
    select_weather: weatherRoles,
    select_seed: seedRoles,
    select_gear: gearRoles,
    select_merchant: merchantRoles,
    select_event: eventRoles
  }[interaction.customId];

  if (!roles) return;

  const member = interaction.member;
  const selected = interaction.values;

  for (const roleObj of roles) {
    const role = interaction.guild.roles.cache.find((r) => r.name === roleObj.roleName);
    if (!role) continue;

    if (selected.includes(roleObj.roleName)) {
      if (!member.roles.cache.has(role.id)) await member.roles.add(role);
    } else {
      if (member.roles.cache.has(role.id)) await member.roles.remove(role);
    }
  }

  await interaction.reply({ content: "✅ Role kamu diperbarui!", flags: 64 });
});

// Handle reputasi
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  // hanya di channel reputasi
  if (message.channel.id !== repChannelId) return;

  // +rep
  if (message.content.startsWith("+rep")) {
    const target = message.mentions.users.first();
    if (!target) return message.reply("⚠️ Gunakan: `+rep @username`");
    if (target.id === message.author.id) return message.reply("❌ Tidak bisa +rep diri sendiri!");

    repData[target.id] = (repData[target.id] || 0) + 1;
    saveRep();

    // Auto role Trusted Seller (≥30)
    const guildMember = await message.guild.members.fetch(target.id);
    const trustedRole = message.guild.roles.cache.find((r) => r.name === trustedRoleName);
    if (trustedRole) {
      if (repData[target.id] >= 30 && !guildMember.roles.cache.has(trustedRole.id)) {
        await guildMember.roles.add(trustedRole);
        message.reply(`✅ Reputasi ${target.username} sekarang **${repData[target.id]}**! 🎉 Dapat role **${trustedRoleName}**!`);
      } else if (repData[target.id] < 30 && guildMember.roles.cache.has(trustedRole.id)) {
        await guildMember.roles.remove(trustedRole);
      } else {
        message.reply(`✅ Reputasi ${target.username} sekarang **${repData[target.id]}**`);
      }
    } else {
      message.reply(`✅ Reputasi ${target.username} sekarang **${repData[target.id]}**`);
    }
  }

  // !rep
  if (message.content.startsWith("!rep")) {
    const target = message.mentions.users.first() || message.author;
    const rep = repData[target.id] || 0;
    return message.reply(`📊 Reputasi ${target.username}: **${rep}**`);
  }

  // !leaderboard
  if (message.content.startsWith("!board")) {
    if (Object.keys(repData).length === 0) return message.reply("📊 Belum ada data reputasi.");
    const sorted = Object.entries(repData).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const leaderboard = await Promise.all(
      sorted.map(async ([id, rep], i) => {
        const user = await client.users.fetch(id);
        return `${i + 1}. **${user.username}** - ${rep} rep`;
      })
    );
    message.reply(`🏆 **Top 5 Reputasi:**\n${leaderboard.join("\n")}`);
  }
});

client.login(token);
