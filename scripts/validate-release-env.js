const requiredKeys = [
  'EXPO_PUBLIC_FIREBASE_API_KEY',
  'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
  'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'EXPO_PUBLIC_FIREBASE_APP_ID',
];

const missing = requiredKeys.filter((key) => {
  const value = process.env[key];
  return !value || value.startsWith('YOUR_') || value.includes('your-project');
});

if (missing.length > 0) {
  console.error(`Missing release environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('Release environment variables look valid.');
