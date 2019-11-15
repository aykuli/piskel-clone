function getLinkToImage() {
  console.log('getLinkToImage function worked');
  const url =
    'https://api.unsplash.com/photos/random?query=town,Novosibirsk&client_id=f56671a471bd8a751f2b5a41d58a8b9a599c7c09655e5e5fc7d9f845e589a94a';
  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log(data.urls.regular);
    });
}

export default getLinkToImage();
