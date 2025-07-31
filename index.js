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
const channelId = process.env.CHANNEL_ID; // channel untuk dropdown

// Express untuk anti-sleep (Railway/hosting gratis)
const app = express();
app.get("/", (req, res) => res.send("Bot Aktif!"));
app.listen(3000, () => console.log("🌐 Web server aktif untuk anti-sleep"));

// Client Discord
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  partials: [Partials.Channel]
});

// Data dropdown role (bisa disesuaikan)
const weatherRoles = [
  { label: "🌧️ Rain", roleName: "Rain" },
  { label: "❄️ Snowing", roleName: "Snowing" },
  { label: "⛈️ Thunder", roleName: "Thunder" }
];
const seedRoles = [{ label: "🍉 Watermelon", roleName: "Watermelon" }];
const gearRoles = [{ label: "💦 Master Sprinkler", roleName: "Master Sprinkler" }];
const merchantRoles = [{ label: "🧙‍♂️ Traveling Merchant", roleName: "traveling merchant" }];
const eventRoles = [{ label: "🎉 Event Ping", roleName: "event" }];

// Client ready → kirim dropdown ke channel
client.once(Events.ClientReady, async () => {
  console.log(`✅ Bot aktif sebagai ${client.user.tag}`);

  try {
    const channel = await client.channels.fetch(channelId);
    if (!channel) return console.log("❌ Channel dropdown tidak ditemukan!");

    // Buat komponen dropdown
    const makeDropdown = (id, placeholder, roles) => {
      const menu = new StringSelectMenuBuilder()
        .setCustomId(id)
        .setPlaceholder(placeholder)
        .setMinValues(0)
        .setMaxValues(roles.length);

      roles.forEach((role) =>
        menu.addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel(role.label)
            .setValue(role.roleName)
        )
      );

      return new ActionRowBuilder().addComponents(menu);
    };

    // Kirim dropdown
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

// Handle interaksi dropdown
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

  // Atur role sesuai pilihan
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

client.login(token);
