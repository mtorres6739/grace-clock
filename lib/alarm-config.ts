// Alarm Sound Configuration
// Add your own sound URLs here

export const CUSTOM_ALARM_URLS = {
  // Replace these with your actual audio file URLs
  // The URLs must be direct links to audio files (mp3, wav, etc)
  // or must allow CORS access if from external domains
  
  alarm1: {
    name: 'Classic Bell',
    description: 'Traditional alarm clock bell',
    url: '' // Example: 'https://example.com/sounds/bell.mp3'
  },
  alarm2: {
    name: 'Digital Beep',
    description: 'Modern digital alarm sound',
    url: '' // Example: 'https://cdn.example.com/audio/beep.wav'
  },
  alarm3: {
    name: 'Gentle Chime',
    description: 'Soft and pleasant wake-up sound',
    url: '' // Example: 'https://sounds.example.com/chime.mp3'
  },
  alarm4: {
    name: 'Urgent Alert',
    description: 'Attention-grabbing alarm',
    url: '' // Example: 'https://audio.example.com/alert.mp3'
  },
  alarm5: {
    name: 'School Bell',
    description: 'Classic school bell ring',
    url: '' // Example: 'https://cdn.sounds.com/school-bell.wav'
  },
  alarm6: {
    name: 'Electronic Buzz',
    description: 'Futuristic alarm sound',
    url: '' // Example: 'https://media.example.com/buzz.mp3'
  }
};

/* 
IMPORTANT NOTES:

1. Direct Audio URLs Required:
   The URLs must be direct links to audio files, not web pages.
   For example: https://example.com/sounds/alarm.mp3

2. CORS Requirements:
   If using external URLs, the server must allow CORS access.
   Otherwise, you'll get a CORS error.

3. Epidemic Sound:
   The Epidemic Sound URLs you provided are web pages, not direct audio files.
   To use Epidemic Sound audio:
   - Download the files from your Epidemic Sound account
   - Host them on a server that allows CORS
   - Or place them in the /public/sounds/ folder

4. Free Alternatives:
   - Freesound.org (requires attribution)
   - Zapsplat.com (free with account)
   - FreeSound.org
   - Your own recordings

5. Local Files:
   You can also use local files by placing them in /public/sounds/
   and using URLs like: /sounds/myalarm.mp3
*/