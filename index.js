// Anti-sleep server
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Bot Aktif!'));
app.listen(3000, () => console.log('🌐 Web server aktif untuk anti-sleep'));

// Discord client setup
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
const channelId = process.env.CHANNEL_ID;

// === DATA ROLE PER KATEGORI ===

// Weather
const weatherRoles = [
  { label: "🌧️ Rain", roleName: "Rain" },
  { label: "❄️ Snowing", roleName: "Snowing" },
  { label: "⛈️ Thunder", roleName: "Thunder" },
  { label: "☄️ Meteor Shower", roleName: "meteor shower" },
  { label: "🔴 Bloodmoon", roleName: "bloodmoon" },
  { label: "🔵 Night", roleName: "night" },
  { label: "💨 Windy", roleName: "windy" },
  { label: "🌡️ Heatwave", roleName: "heatwave" },
  { label: "🌪️ Tornado", roleName: "tornado" },
  { label: "🍫🌧️ Chocolate Rain", roleName: "chocolate rain" },
  { label: "Aurora Event", roleName: "Aurora Event" },
  { label: "🌦️ Tropical Rain", roleName: "tropicalrain" },
  { label: "🌪️ Sandstorm", roleName: "sandstorm" },
  { label: "👑 Admin Abuse", roleName: "adminabuse" },
  { label: "💠 Zenaura", roleName: "zenaura" },
  { label: "💎 Crystalbeam", roleName: "crystalbeam" },
  { label: "💥 Corrupt Zenaura", roleName: "corruptzenaura" },
];

// Seed
const seedRoles = [
  { label: "🍉 Watermelon", roleName: "Watermelon" },
  { label: "🎃 Pumpkin", roleName: "pumpkin" },
  { label: "🍎 Apple", roleName: "Apple" },
  { label: "🎋 Bamboo", roleName: "bamboo" },
  { label: "🥥 Coconut", roleName: "coconut" },
  { label: "🌵 Cactus", roleName: "cactus" },
  { label: "🍠 Dragonfruit", roleName: "dragonfruit" },
  { label: "🥭 Mango", roleName: "mango" },
  { label: "🍇 Grape", roleName: "grape" },
  { label: "🍄 Mushroom", roleName: "mushroom" },
  { label: "🌶️ Bell Pepper", roleName: "bell pepper" },
  { label: "🟤 Cacao", roleName: "cacao" },
  { label: "🥒 Beanstalk", roleName: "beanstalk" },
  { label: "🏵️ Emberlily", roleName: "emberlily" },
  { label: "🍎 Sugar Apple", roleName: "sugar apple" },
  { label: "🏵️ Burningbud", roleName: "burningbud" },
  { label: "🌲 Giant Pinecone", roleName: "giantpinecone" },
  { label: "🍓 Elderstrawberry", roleName: "elderstrawberry" },
];

// Gear
const gearRoles = [
  { label: "💦 Master Sprinkler", roleName: "Master Sprinkler" },
  { label: "💦 Advanced Sprinkler", roleName: "Advanced Sprinkler" },
  { label: "💦 Godly Sprinkler", roleName: "Godly Sprinkler" },
  { label: "🚿 Wateringcan", roleName: "wateringcan" },
  { label: "⛏️ Trowel", roleName: "trowel" },
  { label: "💦 Basic Sprinkler", roleName: "basic sprinkler" },
  { label: "Friendship Pot", roleName: "Friendship pot" },
  { label: "❤️ Favorite Tool", roleName: "favorite tool" },
  { label: "🪞 Tanning Mirror", roleName: "tanning mirror" },
  { label: "Cleaning Spray", roleName: "Cleaning spray" },
  { label: "🔎 Magnifying Glass", roleName: "magnify glass" },
  { label: "🧸 Medium Toy", roleName: "mediumtoy" },
  { label: "🦴 Medium Treat", roleName: "mediumtreat" },
  { label: "🍭 Level Up Lollipop", roleName: "leveluplollipop" },
  { label: "🔧 Recall Wrench", roleName: "recallwrench" },
];

// Merchant & Event
const merchantRoles = [
  { label: "🧙‍♂️ Traveling Merchant", roleName: "Traveling Merchant" },
];
const eventRoles = [
  { label: "🎉 Event Ping", roleName: "Event Ping" },
];

// === DISCORD CLIENT ===
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  partials: [Partials.Channel],
});

client.once(Events.ClientReady, async () => {
  console.log(`✅ Bot aktif sebagai ${client.user.tag}`);

  try {
    const channel = await client.channels.fetch(channelId);
    if (!channel) return console.error("❌ Channel tidak ditemukan!");

    // Kirim dropdown
    const makeDropdown = (id, placeholder, roles) => {
      const menu = new StringSelectMenuBuilder()
        .setCustomId(id)
        .setPlaceholder(placeholder)
        .setMinValues(0)
        .setMaxValues(roles.length);

      roles.forEach((role) =>
        menu.addOptions(
          new StringSelectMenuOptionBuilder().setLabel(role.label).setValue(role.roleName)
        )
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
        makeDropdown("select_event", "🎉 Event", eventRoles),
      ],
    });

    console.log("✅ Dropdown role berhasil dikirim.");
  } catch (err) {
    console.error("❌ Gagal kirim dropdown:", err.message);
  }
});

// Handle dropdown interaction
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;

  const mapping = {
    select_weather: weatherRoles,
    select_seed: seedRoles,
    select_gear: gearRoles,
    select_merchant: merchantRoles,
    select_event: eventRoles,
  };

  const roles = mapping[interaction.customId];
  if (!roles) return;

  const member = interaction.member;
  const selected = interaction.values;

  try {
    for (const roleObj of roles) {
      const role = interaction.guild.roles.cache.find(
        (r) => r.name.toLowerCase() === roleObj.roleName.toLowerCase()
      );
      if (!role) continue;

      try {
        if (selected.includes(roleObj.roleName)) {
          if (!member.roles.cache.has(role.id)) await member.roles.add(role);
        } else {
          if (member.roles.cache.has(role.id)) await member.roles.remove(role);
        }
      } catch (roleErr) {
        console.warn(`⚠️ Tidak bisa ubah role ${roleObj.roleName}:`, roleErr.message);
      }
    }

    await interaction.reply({ content: "✅ Role kamu diperbarui!", ephemeral: true });
  } catch (err) {
    console.error("❌ ERROR:", err.message);
    if (!interaction.replied) {
      await interaction.reply({ content: "❌ Gagal memproses permintaan.", ephemeral: true });
    }
  }
});

client.login(token);
