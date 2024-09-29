import requests
from bs4 import BeautifulSoup
import pandas as pd
import json

# URL of the webpage containing the data
url = "https://www.myscheme.gov.in/search"

# Send a GET request to fetch the webpage content
response = requests.get(url)

# Check if the request was successful
if response.status_code == 200:
    # Parse the HTML content using BeautifulSoup
    soup = BeautifulSoup(response.content, 'html.parser')

    # Find the script tag containing the JSON data
    script_tag = soup.find('script', {'type': 'application/ld+json, text/plain, */*'})

    if script_tag:
        # Extract the JSON data from the script tag
        json_data = json.loads(script_tag.string)
        
        # Access the 'items' key to get the schemes data
        items = json_data['items']

        # Create a DataFrame from the scraped data
        df = pd.DataFrame([item['fields'] for item in items])

        # Save the data to a CSV file
        df.to_csv('schemes_data.csv', index=False)
        
        print("Data scraped and saved to 'schemes_data.csv'.")
    else:
        print("Script tag containing JSON data not found.")
else:
    print(f"Failed to retrieve the webpage. Status code: {response.status_code}")
