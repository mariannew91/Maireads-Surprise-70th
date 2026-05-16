import pandas as pd
import random
from time import sleep
import requests
from bs4 import BeautifulSoup
import os

os.system('cls' if os.name == 'nt' else 'clear')


for page in range(2,11):
    delay = random.uniform(1, 5)
    sleep(delay)

quotes_list = []
authors_list = []

page = 1
while page <= 10:
    url = f'https://quotes.toscrape.com/page/{page}/'

    response = requests.get(url)
    if response.status_code == 404:
        print(f"Page {page} not found. Stopping.")
        break   

    soup = BeautifulSoup(response.text, "html.parser")
    quotes = soup.find_all('span', class_='text')
    authors = soup.find_all('small', class_='author')

    for quote in quotes:
        quotes_list.append(quote.text)

    for author in authors:
        authors_list.append(author.text)

    page += 1
    sleep(2)

data = pd.DataFrame({
    "Quote": quotes_list,
    "Author": authors_list
})

data.to_csv('quotes.csv', index = False)