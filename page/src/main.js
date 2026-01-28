window.onload = function() {
  var hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
  var loadingScreen = document.getElementById('loading-screen');
  var mainContent = document.getElementById('main-content');
  var background = document.getElementById('threejs-background');

  if (hasSeenSplash) {
    // Skip splash screen on return visits - show immediately at final opacity
    loadingScreen.style.display = 'none';
    mainContent.style.display = 'block';
    background.style.opacity = 0.1;
    background.classList.add('below-content');
  } else {
    // Show splash screen on first visit - fade background from 1 to 0.1
    sessionStorage.setItem('hasSeenSplash', 'true');
    setTimeout(function() {
      loadingScreen.style.opacity = 0;
      background.style.transition = 'opacity 2s ease-out';
      background.style.opacity = 0.1;
      setTimeout(function() {
        loadingScreen.style.display = 'none';
        mainContent.style.display = 'block';
        background.classList.add('below-content');
      }, 2000);
    }, 2000);
  }

  var extraInfo = document.getElementById('extra-info');
  extraInfo.style.display = 'none';
};

document.getElementById('toggle-more').addEventListener('click', function(event) {
  event.preventDefault();

  var extraInfo = document.getElementById('extra-info');
  var title = document.getElementById('title');
  var contentSections = document.getElementById('content-sections');

  if (extraInfo.style.display === 'none') {
      extraInfo.style.display = 'block';
      title.style.display = 'none';
      contentSections.style.display = 'none';
  } else {
      extraInfo.style.display = 'none';
      title.style.display = 'block';
      contentSections.style.display = 'block';
  }
});

document.getElementById('close-extra-info').addEventListener('click', function() {
  var extraInfo = document.getElementById('extra-info');
  var title = document.getElementById('title');
  var contentSections = document.getElementById('content-sections');

  extraInfo.style.display = 'none';
  title.style.display = 'block';
  contentSections.style.display = 'block';
});

document.addEventListener("mousemove", (event) => {
  const cursor = document.querySelector(".custom-cursor");
  cursor.style.left = `${event.clientX}px`;
  cursor.style.top = `${event.clientY}px`;
});
