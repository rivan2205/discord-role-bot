// index.js
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
const channelId = process.env.CHANNEL_ID;

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
  { label: "Aurora Event", roleName: "Aurora event" },
  { label: "🌦️ Tropical Rain", roleName: "tropicalrain" },
  { label: "🌪️ Sandstorm", roleName: "sandstorm" },
  { label: "👑 Admin Abuse", roleName: "adminabuse" },
  { label: "💠 Zenaura", roleName: "zenaura" },
  { label: "💎 Crystalbeam", roleName: "crystalbeam" },
  { label: "💥 Corrupt Zenaura", roleName: "corruptzenaura" }
];

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
  { label: "🍓 Elderstrawberry", roleName: "elderstrawberry" }
];

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
  { label: "🔧 Recall Wrench", roleName: "recallwrench" }
];

const merchantRoles = [
  { label: "🧙‍♂️ Traveling Merchant", roleName: "🧙‍♂️traveling merchant" }
];

const eventRoles = [
  { label: "🎉 Event Ping", roleName: "Event Ping" }
];

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  partials: [Partials.Channel]
});

client.once(Events.ClientReady, async () => {
  console.log(`✅ Bot aktif sebagai ${client.user.tag}`);
  try {
    const channel = await client.channels.fetch(channelId);
    if (!channel) return console.error("❌ Channel tidak ditemukan!");

    const makeDropdown = (id, placeholder, roles) => {
      const menu = new StringSelectMenuBuilder()
        .setCustomId(id)
        .setPlaceholder(placeholder)
        .setMinValues(0)
        .setMaxValues(roles.length);

      roles.forEach(role =>
        menu.addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel(role.label)
            .setValue(role.roleName)
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
        makeDropdown("select_event", "🎉 Event", eventRoles)
      ]
    });

    console.log("✅ Dropdown role sudah dikirim!");
  } catch (err) {
    console.error("❌ Gagal kirim dropdown:", err.message);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;

  try {
    await interaction.deferReply({ ephemeral: true });

    const roleMap = {
      select_weather: weatherRoles,
      select_seed: seedRoles,
      select_gear: gearRoles,
      select_merchant: merchantRoles,
      select_event: eventRoles
    };

    const roles = roleMap[interaction.customId];
    if (!roles) return;

    const member = interaction.member;
    const selected = interaction.values;

    const tasks = roles.map(async (roleObj) => {
      const role = interaction.guild.roles.cache.find(r => r.name === roleObj.roleName);
      if (!role) return;

      try {
        if (selected.includes(roleObj.roleName)) {
          if (!member.roles.cache.has(role.id)) await member.roles.add(role);
        } else {
          if (member.roles.cache.has(role.id)) await member.roles.remove(role);
        }
      } catch (err) {
        console.error(`❌ Gagal set role ${roleObj.roleName}:`, err.message);
      }
    });

    await Promise.all(tasks);
    await interaction.editReply("✅ Role kamu berhasil diperbarui!");
  } catch (err) {
    console.error("❌ Gagal proses interaksi:", err.message);
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply("❌ Terjadi kesalahan saat mengatur role.");
    } else {
      await interaction.reply({ content: "❌ Terjadi kesalahan saat mengatur role.", ephemeral: true });
    }
  }
});

client.login(token);
