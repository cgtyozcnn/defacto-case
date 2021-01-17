const filterLinks = (items, filterType = "default") => {
  return items.sort((a, b) => {
    //Sayfa ilk yüklenirken yani default değere sahipken sıralama sadece createdTime a göre yapılacak.
    if (filterType !== "default") {
      if (filterType === "desc") {
        if (a.vote > b.vote) return -1;
        if (a.vote < b.vote) return 1;
      } else if (filterType === "asc") {
        if (a.vote < b.vote) return -1;
        if (a.vote > b.vote) return 1;
      }
    }
    // Eğer bağlantıların vote sayıları aynı ise createdTime a göre sıralanacak
    // En son oluşturulan kayıt yukarıda
    // Diğer kayıt ise aşağıda gösterilecek
    if (a.createdTime < b.createdTime) return 1;
    if (a.createdTime > b.createdTime) return -1;
  });
};
const generatePages = (linkCount) => {
  let pageCount = Math.ceil(linkCount / 5);
  let pageCounts = [];
  for (let i = 1; i <= pageCount; i++) {
    pageCounts.push(i);
  }
  return pageCounts;
};

const validators = (value, validate) => {
  let isValid = true;
  if (validate === "required" && value === "") {
    isValid = false;
  }
  return isValid;
};

// exports.filterLinks = filterLinks;
// exports.generatePages = generatePages;
// exports.validators = validators;
