# Alarm Sound Files

Place your alarm sound files in this directory with the following filenames:

- `alarm1.mp3` - Classic Alarm (Traditional alarm clock bell)
- `alarm2.mp3` - Digital Beep (Modern digital alarm sound)
- `alarm3.mp3` - Gentle Chime (Soft and pleasant wake-up sound)
- `alarm4.mp3` - Urgent Alert (Attention-grabbing alarm)
- `alarm5.mp3` - School Bell (Classic school bell ring)
- `alarm6.mp3` - Electronic Buzz (Futuristic alarm sound)

## File Requirements:
- Format: MP3 (recommended) or any web-compatible audio format
- Duration: Loops automatically, so short clips (5-10 seconds) work well
- Size: Keep files under 1MB for optimal loading

## How to Add Your Epidemic Sound Files:

1. Download the sound effects from Epidemic Sound (requires valid license)
2. Rename the files according to the list above
3. Place them in this `/public/sounds/` directory
4. The app will automatically use these files instead of the generated sounds

## Fallback:
If an audio file is not found, the app will fall back to generated sounds using the Web Audio API.

## Example Mapping for Your Links:
Based on the Epidemic Sound links you provided, you could map them like this:
- First link → alarm1.mp3
- Second link → alarm2.mp3
- Third link → alarm3.mp3
- Fourth link → alarm4.mp3
- Fifth link → alarm5.mp3
- Sixth link → alarm6.mp3