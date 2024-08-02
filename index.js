const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('voiceStateUpdate', (oldState, newState) => {
    // Check if the user who joined the voice channel is "DWAS"
    if (newState.member.user.username === 'DWAS' && !oldState.channel && newState.channel) {
        const channel = newState.channel;

        // Join the voice channel
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });

        // Create an audio player
        const player = createAudioPlayer();

        // Create an audio resource
        const resource = createAudioResource(path.join(__dirname, 'your-audio-file.mp3'));

        // Play the audio resource
        player.play(resource);
        connection.subscribe(player);

        player.on(AudioPlayerStatus.Idle, () => {
            connection.destroy();
        });
    }
});

// Use the environment variable for the bot token
client.login(process.env.DISCORD_BOT_TOKEN);
