# Audio URLs Guide for Clock App

## How to Use Direct Audio URLs

### Option 1: Free Sound Services
Here are some services that provide direct audio URLs:

1. **Freesound.org** (requires free account)
   - Search for alarm sounds
   - Click on a sound
   - Right-click the download button
   - Copy link address
   - Example: `https://freesound.org/data/previews/123/123456_1234567-lq.mp3`

2. **Zapsplat.com** (free with account)
   - Search for alarm sounds
   - Download the file
   - Upload to your own server or CDN
   - Use the direct URL

3. **GitHub/GitLab**
   - Upload audio files to a public repository
   - Use the raw file URL
   - Example: `https://raw.githubusercontent.com/username/repo/main/sounds/alarm.mp3`

### Option 2: Cloud Storage
Upload your audio files to:

1. **Cloudinary** (free tier available)
   - Upload audio files
   - Get direct URLs with CORS support
   - Example: `https://res.cloudinary.com/demo/video/upload/alarm.mp3`

2. **AWS S3** (with public access)
   - Upload to S3 bucket
   - Make files public
   - Use direct S3 URLs

3. **Google Drive** (limited)
   - Upload file
   - Get shareable link
   - Convert to direct download URL

### Option 3: Local Development
For testing, you can:

1. Place audio files in `/public/sounds/`
2. Use URLs like `/sounds/alarm1.mp3`
3. These will work locally and when deployed

### Option 4: Epidemic Sound
To use Epidemic Sound tracks:

1. Log into your Epidemic Sound account
2. Download the tracks you want
3. Host them on one of the services above
4. Use the direct URLs in the config

### Adding URLs to Your App

1. Open `/lib/alarm-config.ts`
2. Replace the empty strings with your URLs:

```typescript
alarm1: {
  name: 'My Custom Alarm',
  description: 'A great alarm sound',
  url: 'https://your-actual-url-here.com/alarm.mp3'
}
```

### CORS Requirements
If using external URLs, ensure the server allows CORS:
- The server must include `Access-Control-Allow-Origin: *` header
- Or specifically allow your domain

### Testing Your URLs
1. Open your browser console
2. Run: `new Audio('your-url-here').play()`
3. If it plays, it will work in the app!