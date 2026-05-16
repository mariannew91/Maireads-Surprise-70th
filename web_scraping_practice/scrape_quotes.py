import requests
from bs4 import BeautifulSoup
import os
import pandas as pd
from time import sleep
import random
import matplotlib.pyplot as plt
os.system('cls' if os.name == 'nt' else 'clear')

html_text = requests.get("https://quotes.toscrape.com/")
soup = BeautifulSoup(html_text.text, "html.parser")

quotes = soup.find_all('span', class_='text')
authors = soup.find_all('small', class_='author')
tags = soup.find_all('a', class_='tag')

quote_list = []
author_list = []
tag_list = []

for i in range(len(quotes)):
    quote_list.append(quotes[i].text)
    author_list.append(authors[i].text)
    tag_list.append(tags[i].text)

data = {
    "Quote": quote_list,
    "Author": author_list,
    "Tag": tag_list
}
df = pd.DataFrame(data)
#print(df)

df['Quote Length'] = df['Quote'].apply(len)
#plt.bar(df['Author'], df['Quote Length'])
#plt.title('Quote Length by Author')
#plt.xlabel('Author')
#plt.ylabel('Quote Length')
#plt.show()
df.plot(x="Author", y="Quote Length", kind="hist", title="Length of Quotes by Author")
#plt.show()