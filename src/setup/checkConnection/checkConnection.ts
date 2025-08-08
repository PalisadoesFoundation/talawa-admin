export async function checkConnection(url: string): Promise<boolean> {
  console.log('\nChecking Talawa-API connection....');
  let isConnected = false;
  await fetch(url)
    .then(() => {
      isConnected = true;
      console.log('\nConnection to Talawa-API successful! 🎉');
    })
    .catch(() => {
      console.log(
        '\nTalawa-API service is unavailable. Is it running? Check your network connectivity too.',
      );
    });
  return isConnected;
}
