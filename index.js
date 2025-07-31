// ... bagian atas tetap sama (express dan require)

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
  { label: "Aurora Event", roleName: "Aurora Event" },
  { label: "🌦️ Tropical Rain", roleName: "tropicalrain" },
  { label: "🌪️ Sandstorm", roleName: "sandstorm" },
  { label: "👑 Admin Abuse", roleName: "adminabuse" },
  { label: "💠 Zenaura", roleName: "zenaura" },
  { label: "💎 Crystalbeam", roleName: "crystalbeam" },
  { label: "💥 Corrupt Zenaura", roleName: "corruptzenaura" },
];

const seedRoles = [/* tetap sama */];
const gearRoles = [/* tetap sama */];
const merchantRoles = [
  { label: "🧙‍♂️ Traveling Merchant", roleName: "Traveling Merchant" }, // perbaikan di sini
];
const eventRoles = [
  { label: "🎉 Event Ping", roleName: "Event Ping" }, // perbaikan di sini
];

// ... client & dropdown tetap sama

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

  if (!interaction.guild || !member) {
    return interaction.reply({ content: "⚠️ Tidak dapat membaca member/guild.", ephemeral: true });
  }

  try {
    for (const roleObj of roles) {
      const role = interaction.guild.roles.cache.find(
        (r) => r.name.toLowerCase() === roleObj.roleName.toLowerCase()
      );
      if (!role) {
        console.warn(`❗ Role tidak ditemukan: ${roleObj.roleName}`);
        continue;
      }

      try {
        if (selected.includes(roleObj.roleName)) {
          if (!member.roles.cache.has(role.id)) await member.roles.add(role);
        } else {
          if (member.roles.cache.has(role.id)) await member.roles.remove(role);
        }
      } catch (roleErr) {
        console.error(`❌ Gagal ubah role: ${role.name}`, roleErr.message);
      }
    }

    await interaction.reply({ content: "✅ Role kamu diperbarui!", ephemeral: true });

  } catch (err) {
    console.error("❌ ERROR GLOBAL:", err.message);
    if (!interaction.replied) {
      interaction.reply({ content: "❌ Terjadi kesalahan saat memperbarui role.", ephemeral: true });
    }
  }
});
