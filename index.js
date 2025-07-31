const express = require('express'); // Web server anti-sleep (useful for some hosts)
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

// ==== 1. Data role per kategori ====

// 🌦️ Weather
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
  { label: "💥 Corrupt Zenaura", roleName: "corruptzenaura" },
];

// 🌱 Seed
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

// ⚙️ Gear
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

// 🧙‍♂️ Traveling Merchant
const merchantRoles = [
  { label: "🧙‍♂️ Traveling Merchant", roleName: "traveling merchant" },
];

// 🎉 Event
const eventRoles = [
  { label: "🎉 Event Ping", roleName: "event" },
];

// ==== 2. Setup Bot ====
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel]
});

// ==== 3. Kirim Dropdown Otomatis ====
client.once(Events.ClientReady, async () => {
  console.log(`✅ Bot aktif sebagai ${client.user.tag}`);

  const channelId = process.env.CHANNEL_ID;
  if (!channelId) {
    console.error('❌ CHANNEL_ID belum di-set. Tambahkan ke .env atau Environment Variables.');
    return;
  }

  let channel;
  try {
    channel = await client.channels.fetch(channelId);
  } catch (e) {
    console.error('❌ Gagal fetch channel. Pastikan bot ada di server dan CHANNEL_ID benar.');
    return;
  }

  if (!channel) {
    console.error('❌ Channel tidak ditemukan!');
    return;
  }

  // Fungsi buat dropdown
  const makeDropdown = (id, placeholder, data) => {
    const menu = new StringSelectMenuBuilder()
      .setCustomId(id)
      .setPlaceholder(placeholder)
      .setMinValues(0)
      .setMaxValues(data.length);

    data.forEach(role =>
      menu.addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel(role.label)
          .setValue(role.roleName)
      )
    );
    return new ActionRowBuilder().addComponents(menu);
  };

  // Kirim 5 dropdown
  await channel.send({
    content: '**Pilih role sesuai kategori:**',
    components: [
      makeDropdown('select_weather', '🌦️ Weather', weatherRoles),
      makeDropdown('select_seed', '🌱 Seed', seedRoles),
      makeDropdown('select_gear', '⚙️ Gear', gearRoles),
      makeDropdown('select_merchant', '🧙‍♂️ Traveling Merchant', merchantRoles),
      makeDropdown('select_event', '🎉 Event', eventRoles),
    ]
  });

  console.log('✅ Dropdown sudah dikirim ke channel!');
});

// ==== 4. Handler saat user pilih dropdown ====
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isStringSelectMenu()) return;

  // Tentukan kategori
  const category = interaction.customId.split('_')[1];
  let categoryRoles = [];

  if (category === 'weather') categoryRoles = weatherRoles;
  if (category === 'seed') categoryRoles = seedRoles;
  if (category === 'gear') categoryRoles = gearRoles;
  if (category === 'merchant') categoryRoles = merchantRoles;
  if (category === 'event') categoryRoles = eventRoles;

  const selectedRoles = interaction.values;
  const member = interaction.member;

  // Toggle role
  for (const roleInfo of categoryRoles) {
    const role = interaction.guild.roles.cache.find(r => r.name === roleInfo.roleName);
    if (!role) continue;

    if (selectedRoles.includes(roleInfo.roleName)) {
      if (!member.roles.cache.has(role.id)) {
        await member.roles.add(role);
      }
    } else {
      if (member.roles.cache.has(role.id)) {
        await member.roles.remove(role);
      }
    }
  }

  await interaction.reply({ content: '✅ Role kamu sudah diperbarui!', flags: 64 });
});

client.login(process.env.DISCORD_TOKEN);
