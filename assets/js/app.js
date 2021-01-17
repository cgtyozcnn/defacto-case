let currentLocation = window.location.href;
let url = new URL(currentLocation);
let params = url.searchParams;

const navigateTo = (pUrl) => {
  params = url.searchParams;
  params.delete("page");
  params.set("page", `${pUrl}`);
  window.history.pushState(null, null, url);

 
  if (pUrl === "addLink") {

    initAddLink();
  } else if ((pUrl = "links")) {
    initHome();
  } else {
    initHome();
  }
};

const initApp = () => {
  params.delete("page");
  window.history.pushState(null, null, url);
  
  let navlinkElements = [...document.querySelectorAll("[data-nav-link]")];
  navlinkElements.map((navLink) => {
    navLink.addEventListener("click", (event) => {
      event.preventDefault();
      navlinkElements.map((element) => {
        element.classList.remove("active");
      });
      navLink.classList.add("active");

      navigateTo(navLink.getAttribute("href"));
    });
  });

  initHome();
};

initApp();
