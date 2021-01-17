const convertAddLinkToHtmlString = () => {
  return `          
        <form id="submitForm" class="place-form">
            <div class="input-control">
              <label>Title*</label>
              <Input type="text" name="title" validate="required"/>
            </div>
            <button type="submit" class="btn btn-danger">Submit</button>
        </form>`;
};

const onSubmitHandler = (event) => {
  event.preventDefault();
  let message = "";
  let inputValue = document.querySelector('input[name="title"]').value;
  let links = [];
  let validate = document
    .querySelector('input[name="title"]')
    .getAttribute("validate");

  if (validators(inputValue, validate)) {
    if (localStorage.getItem("linksData")) {
      links = JSON.parse(localStorage.getItem("linksData"));
    }
    let newLink = {
      id: moment().millisecond(),
      title: inputValue,
      vote: 0,
      createdTime: moment(),
    };
    links.push(newLink);
    localStorage.setItem("linksData", JSON.stringify(links));
    message = "Kayıt başarılı bir şekilde oluşturudu!";
    document.querySelector(".input-control").classList.remove("input-control--invalid");
  } else {
    message = "Title alanı boş bırakılamaz!";
    document.querySelector(".input-control").classList.add("input-control--invalid");
    
  }

 
  document.querySelector("#infoMessage").classList.remove("d-none");
  document.querySelector("#infoMessage").innerHTML = message;
  setTimeout(() => {
    document.querySelector("#infoMessage").classList.add("d-none");
    document.querySelector("#infoMessage").innerHTML = "";
  }, 1000);
 
};

const initAddLink = () => {
  document.querySelector("#app").innerHTML = "";
  const domAddLinkElement = new DOMParser().parseFromString(
    convertAddLinkToHtmlString(),
    "text/html"
  );
  const domElement = domAddLinkElement.body.firstChild;
  document.querySelector("#app").append(domElement);

  domElement.addEventListener("submit", onSubmitHandler);
};
