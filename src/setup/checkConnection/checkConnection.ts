export async function checkConnection(
  url: string,
  timeout: number = 5000,
): Promise<boolean> {
  console.log('\nChecking Talawa-API connection....');

  const timeoutPromise = new Promise<boolean>((_, reject) => {
    setTimeout(() => {
      reject(new Error('Connection timeout'));
    }, timeout);
  });

  const fetchPromise = fetch(url)
    .then(() => {
      console.log('\nConnection to Talawa-API successful! 🎉');
      return true;
    })
    .catch(() => {
      console.log(
        '\nTalawa-API service is unavailable. Is it running? Check your network connectivity too.',
      );
      return false;
    });

  try {
    // Race between fetch and timeout
    return await Promise.race([fetchPromise, timeoutPromise]);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Connection timeout') {
        console.error(
          '\nConnection attempt timed out. Please check the Talawa-API service or your network.',
        );
      } else {
        console.error('\nAn unexpected error occurred:', error.message);
      }
    } else {
      console.error('Unknown error:', error);
    }
    return false;
  }
}
