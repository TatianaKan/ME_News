const API_KEY = '8346c79c66fa4f32aad99b7f773ce59d';
const choiseElem = document.querySelector('.js-choise');
const newsList = document.querySelector('.news-list');
const formSearch = document.querySelector('.form-search');

const title = document.querySelector('.title-search');

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

const getDateCorrectFormat = isoDate => {
  const date = new Date(isoDate);
  const fullDate = date.toLocaleString('en-GB', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });

  const fullTime = date.toLocaleString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `<span class="news-date">${fullDate}</span> ${fullTime}`
};

const getImage = (url) => new Promise((resolve) => {
  const image = new Image(270, 200);

  image.addEventListener('load', () => {
    resolve(image);
  });

  image.addEventListener('error', () => {
    image.src = url || 'image/nophoto.jpg';
    resolve(image);
  });

  image.src = url || 'image/nophoto.jpg';
  image.classList = 'news-image';

  return image;
});

const renderCard =  (data) => {
  newsList.textContent = '';
  data.forEach(async({ urlToImage, title, url, description, publishedAt, author }) => {
    const cart = document.createElement('li');
    cart.className = 'news-item';

    const image = await getImage(urlToImage);
    cart.append(image);
    image.alt = title;

    cart.insertAdjacentHTML('beforeend', `
      <h3 class="news-title">
        <a class="news-link" href="${url}" target="_blank">${title}</a>
      </h3>
        <p class="news-description">${description || ''}</p>
      <div class="news-footer">
        <time class="news-datetime" datetime="${publishedAt}">
        ${getDateCorrectFormat(publishedAt)}</time>
        <div class="news-author">${author || ''}</div>
      </div>
  `);

    newsList.append(cart);
  });
};

const loadNews = async () => {
  newsList.innerHTML = '<li class="preload"></li>';

  const country = localStorage.getItem('country') || 'ru';
  choise.setChoiceByValue(country);
  title.classList.add('hide');

  const data = await getdata(`https://newsapi.org/v2/top-headlines?country=${country}&pageSize=20&category=sports`);
  renderCard(data.articles);
};

const loadSearch = async (value) => {
  choise.setChoiceByValue('');
  const data = await getdata(`https://newsapi.org/v2/everything?q=${value}`);
  title.classList.remove('hide');
  title.textContent = `По вашему запросу “${value}” найдено ${data.articles.length} результатов`;
  renderCard(data.articles);
}

choiseElem.addEventListener('change', (event) => {
  const value = event.detail.value;
  localStorage.setItem('country', value);
  loadNews();
});

formSearch.addEventListener('submit', event => {
  event.preventDefault();
  loadSearch(formSearch.search.value);
  formSearch.reset();
})

loadNews();