const choiseElem = document.querySelector('.js-choise');
console.log(choiseElem);
const choise = new Choices(choiseElem, {
  searchEnabled: false,
  itemSelectText: '',
});