const API_KEY = '8346c79c66fa4f32aad99b7f773ce59d';

const choiseElem = document.querySelector('.js-choise');

const newsList = document.querySelector('.news-list');

const choise = new Choices(choiseElem, {
  searchEnabled: false,
  itemSelectText: '',
});

const getdata = async (url) => {
  const response = await fetch(url, {
    headers: {
      'X-Api-Key': API_KEY,
    }
  });

  const data = await response.json();

  return data;
};

const renderCard = (data) => {
  newsList.textContent = '';
data.forEach(news => {
  const cart = document.createElement('li');
  cart.className = 'news-item';

  cart.innerHTML = `
  <img class="news-image" src="${news.urlToImage}" alt="${news.title}"
              width="270px" height="200px">

            <h3 class="news-title">
              <a class="news-link" href="${news.url}" target="_blank">${news.title}</a>
            </h3>

            <p class="news-description">
            ${news.description}
            </p>

            <div class="news-footer">
              <time class="news-datetime" datetime="${news.publishedAt}">
                <span class="news-date">${news.publishedAt}</span>11:06
              </time>

              <div class="news-author">${news.author}</div>

            </div>
  `;

  newsList.append(cart)
});
};


const loadNews = async () => {
  const data = await getdata('https://newsapi.org/v2/top-headlines?country=ru');
  renderCard(data.articles);
};

loadNews();