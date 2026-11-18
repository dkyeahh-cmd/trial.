const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const express = require('express');

// إنشاء سيرفر ويب بسيط عشان Render يفتح بورت وما يعطي Timeout
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Bot is running and alive 24/7!');
});

app.listen(PORT, () => {
    console.log(`Web server is running on port ${PORT}`);
});

// إعدادات بوت الديسكورد
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

const VOICE_CHANNEL_ID = '1570325536427868192';

client.once('ready', async () => {
    console.log(`تم تسجيل الدخول بنجاح باسم ${client.user.tag}`);

    // ضبط الحالة على Streaming
    client.user.setPresence({
        activities: [{
            name: '.',
            type: ActivityType.Streaming,
            url: 'https://www.twitch.tv/twitch'
        }],
        status: 'online',
    });

    // دخول الروم الصوتي مع عكس المايك والسماعة
    try {
        const channel = await client.channels.fetch(VOICE_CHANNEL_ID);
        if (channel && channel.isVoiceBased()) {
            joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
                selfDeaf: true,   // السماعة مغلقة
                selfMute: false   // المايك مفتوح
            });
            console.log(`تم بنجاح الانضمام للروم الصوتي: ${channel.name}`);
        } else {
            console.log('الروم الصوتي غير موجود أو ليس روم صوتي!');
        }
    } catch (error) {
        console.error('خطأ أثناء محاولة دخول الروم الصوتي:', error.message);
    }
});

process.on('unhandledRejection', error => {
    console.error('خطأ غير معالج تم تجنبه:', error);
});

client.login(process.env.DISCORD_TOKEN);