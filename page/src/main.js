window.onload = function() {
  setTimeout(function() {
      document.getElementById('loading-screen').style.opacity = 0;
      setTimeout(function() {
          document.getElementById('loading-screen').style.display = 'none';
          document.getElementById('main-content').style.display = 'block';
      }, 2000); // Matches the fade-out duration
  }, 2000); // Time for the loading screen to be visible (3 seconds)

      document.getElementById('threejs-background').style.opacity = 0.1;

  var extraInfo = document.getElementById('extra-info');
  extraInfo.style.display = 'none';
};

document.getElementById('toggle-more').addEventListener('click', function(event) {
  event.preventDefault(); // Prevent default anchor behavior

  var extraInfo = document.getElementById('extra-info');
  var title = document.getElementById('title');
  var projects = document.getElementById('projects');

  if (extraInfo.style.display === 'none') {
      extraInfo.style.display = 'block';
      title.style.display = 'none';
      projects.style.display = 'none';
  } else {
      extraInfo.style.display = 'none';
      title.style.display = 'block';
      projects.style.display = 'block';
  }
});

document.getElementById('close-extra-info').addEventListener('click', function() {
  var extraInfo = document.getElementById('extra-info');
  var title = document.getElementById('title');
  var projects = document.getElementById('projects');

  extraInfo.style.display = 'none';
  title.style.display = 'block';
  projects.style.display = 'block';
});

document.addEventListener("mousemove", (event) => {
  const cursor = document.querySelector(".custom-cursor");
  cursor.style.left = `${event.clientX}px`;
  cursor.style.top = `${event.clientY}px`;
});
