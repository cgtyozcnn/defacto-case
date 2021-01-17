//HTML üretilen fonksiyonlar
const convertLinkToHtmlString = (item) => {
  return `
        <li class="link-item">
            <div class="card link-item__content">
                <div class="link-item__info">
                <span class="link-item__content-delete d-none" data-delete-action="${
                  item.id
                }"  data-bs-toggle="modal" data-bs-target="#deleteModal">x</span>
                    <p>Created Time: ${moment(item.createdTime).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )}</p>
                    <h3>${item.title}</h3>
                    <p>Vote: <span data-vote-count>${item.vote}</span></p>
                </div>
                <div class="link-item__actions">
                    <button type="button" class="btn btn-danger" data-vote-action="down">DOWN VOTE 
                        <span class="badge bg-primary"></span>
                    </button>
                    <button type="button" class="btn btn-success" data-vote-action="up">UP VOTE 
                        <span class="badge bg-primary"></span>
                    </button>
                </div>
            </div>
        </li>
        `;
};
const convertFilterButtonToHtmlString = () => {
  return `          
    <div class="links__actions">
        <button type="button" class="btn btn-outline-dark " data-filter-action="asc">
            Increasing
        </button>
        <button type="button" class="btn btn-outline-dark " data-filter-action="desc">
            Decreasing
        </button>
    </div>`;
};
const convertPaginationToHtmlString = (page) => {
  return `
        <li>
            <a class="links-pages__button" data-page-action=${page}>${page}</a>
        </li>`;
};
//

let to = 0;
let from = 5;
let currentPage = 1;
let existingLinks = [];
let filterType = "";

const deleteHandler = (linkId) => {
  let updatedLinks = existingLinks.filter(
    (item) => item.id.toString() !== linkId
  );
  localStorage.setItem("linksData", JSON.stringify(updatedLinks));
  existingLinks = [...updatedLinks];
  
  if (existingLinks.length === 0) {
    document.querySelector(
      ".links"
    ).innerHTML = `<h2 class="text-center">Kayıt Bulunamadı</h2>`;
  } else {
    //Mevcut bulunduğum sayfada kayıt kalmadı ise bir önceki sayfaya yönlendirmesi sağlandı
    if (existingLinks.length <= to && to !== 0) {
      from -= 5;
      to -= 5;
    }
    if (filterType != "") {
      generateLinksElement(filterLinks(existingLinks, filterType));
    } else {
      generateLinksElement(existingLinks);
    }
  }

  document.querySelector("#infoMessage").classList.remove("d-none");
  document.querySelector("#infoMessage").innerHTML =
    "Kayıt başarılı bir şekilde silindi!";
  setTimeout(() => {
    document.querySelector("#infoMessage").classList.add("d-none");
    document.querySelector("#infoMessage").innerHTML = "";
  }, 1000);
};
const voteChangeHandler = (linkId, direction) => {
  let updatedLinks = [...existingLinks];
  let index = updatedLinks.findIndex((link) => link.id === linkId);
  if (direction === "down" && updatedLinks[index].vote !== 0) {
    updatedLinks[index].vote -= 1;
  }
  if (direction === "up") {
    updatedLinks[index].vote += 1;
  }

  localStorage.setItem("linksData", JSON.stringify(updatedLinks));

  //Oy kullanıldıktan sonra kayıtlar filtreleniyor.
  //Liste yeniden oluşturuluyor.
  let filteredLinks = filterLinks(updatedLinks, "desc");
  filterType = "desc";
  existingLinks = [...filteredLinks];
  generateLinksElement(filteredLinks);
};

const generateLinksElement = (links) => {
  let linkListElement = document.querySelector(".links-list");

  linkListElement.innerHTML = "";

  let linkData = [...links];
  linkData = linkData.slice(to, from);

  linkData.map((item, index) => {
    const domElement = new DOMParser().parseFromString(
      convertLinkToHtmlString(item),
      "text/html"
    );
    const element = domElement.body.firstChild;
    linkListElement.append(element);

    [...element.querySelectorAll("[data-vote-action]")].map((button) => {
      button.addEventListener("click", (event) => {
        const direction = event.target.getAttribute("data-vote-action");
        const linkId = item.id;
        voteChangeHandler(linkId, direction);

        // element.querySelector("[data-vote-count]").innerHTML =
        //   updatedLinks[index].vote;
      });
    });

    [...element.querySelectorAll(".link-item__info")].map((element) => {
      element.addEventListener("mouseover", (event) => {
        element.classList.add("hovered");
        element.firstElementChild.classList.remove("d-none");
      });
      element.addEventListener("mouseout", (event) => {
        element.classList.remove("hovered");
        element.firstElementChild.classList.add("d-none");
      });
    });

    [...element.querySelectorAll("[data-delete-action]")].map((button) => {
      button.addEventListener("click", (event) => {
        let linkId = event.target.getAttribute("data-delete-action");
        document
          .querySelector("[delete-modal-action]")
          .setAttribute("delete-modal-action", linkId);
      });
    });
  });
};
const generatePageElement = () => {
  if (document.querySelector(".links-pages"))
    document.querySelector(".links-pages").innerHTML = "";

  let pages = [];
  let links = [...existingLinks];
  pages = generatePages(links.length);

  if (pages.length !== 1) {
    pages.map((item, index) => {
      const domElement = new DOMParser().parseFromString(
        convertPaginationToHtmlString(item),
        "text/html"
      );
      const pageElement = domElement.body.firstChild;
      document.querySelector(".links-pages").append(pageElement);

      [...pageElement.querySelectorAll("[data-page-action]")].map((page) => {
        page.addEventListener("click", (event) => {
          let page = event.target.getAttribute("data-page-action");
          //Mevcut bulunan sayfaya göre gösterilecek kayıtlar.
          //Ornek: Mevcut sayfa 2
          //from = 2 * 5 = 10, to = 10 - 5 = 5
          //5 ile 10 arası kayıtlar gösterilir.
          var updatedfrom = page * 5;
          from = updatedfrom;
          to = updatedfrom - 5;
          currentPage = page;
          generateLinksElement(existingLinks);
        });
      });
    });
  }
};

const initHome = () => {
  if (localStorage) {
    if (localStorage.getItem("linksData")) {
      existingLinks = JSON.parse(localStorage.getItem("linksData"));

      document.querySelector("#app").innerHTML = "";

      const mainDivElement = document.createElement("div");
      mainDivElement.classList.add("links");
      document.querySelector("#app").append(mainDivElement);

      if (existingLinks.length !== 0) {
        const domFilterElements = new DOMParser().parseFromString(
          convertFilterButtonToHtmlString(),
          "text/html"
        );

        const domElement = domFilterElements.body.firstChild;
        document.querySelector(".links").append(domElement);

        [...document.querySelectorAll("[data-filter-action]")].map(
          (filterButton) => {
            filterButton.addEventListener("click", (event) => {
              const filterAction = event.target.getAttribute(
                "data-filter-action"
              );
              //filtre tipine göre kayıtlar yeniden filtreleniyor.
              let filteredLinks = filterLinks(existingLinks, filterAction);
              filterType = filterAction;
              generateLinksElement(filteredLinks);
            });
          }
        );
        //Kayıt silmek için oluşturulan click eventi
        [...document.querySelectorAll("[delete-modal-action]")].map(
          (filterButton) => {
            filterButton.addEventListener("click", (event) => {
              let deleteLinkId = event.target.getAttribute(
                "delete-modal-action"
              );

              deleteHandler(deleteLinkId);
              generatePageElement();
            });
          }
        );
        //Link listesi elementi oluşturuldu.
        const linkListElement = document.createElement("ul");
        linkListElement.classList.add("links-list");
        document.querySelector(".links").append(linkListElement);

        //Page listesi elementi oluşturuldu
        const pageListElement = document.createElement("ul");
        pageListElement.classList.add("links-pages");
        document.querySelector(".links").append(pageListElement);

        generateLinksElement(filterLinks(existingLinks));
        generatePageElement();
      } else {
        mainDivElement.innerHTML = `<h2 class="text-center">Kayıt Bulunamadı</h2>`;
      }
    }
  }
};
