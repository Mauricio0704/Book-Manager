const bookshelf = document.getElementById("bookshelf");
//const addOrEditBookBtn = document.getElementById("add-or-edit-book-btn");
const bookForm = document.getElementById("book-form");
const confirmBook = document.getElementById("confirm-book");
const closeFormBtn = document.getElementById("close-form-btn");
const bookTitle = document.getElementById("book-title");
const bookAuthor = document.getElementById("book-author");
const searchBookInput = document.getElementById("search-book-input");
const searchResultsContainer = document.getElementById("search-results");
const searchBookForm = document.getElementById("search-book");
const searchContainer = document.getElementById("search-book-api");
const closeSearchBtn = document.getElementById("close-search");
const myBooksSection = document.getElementById("mybooks")
const bookImage = document.getElementById("book-image");
const bookStatus = document.getElementById("book-status");
const statusRead = document.getElementById("status-read");
const statusReading = document.getElementById("status-reading");
const statusToRead = document.getElementById("status-to-read");
const orderByDropdown = document.getElementById("order-by");
let showBooksRead = statusRead.checked ? "Read" : "";
let showBooksReading = statusReading.checked ? "Reading" : "";
let showBooksToRead = statusReading.checked ? "To read" : "";

let currentBook = {};

const myBooks = JSON.parse(localStorage.getItem("data")) || [
  {
    title: "El alquimista",
    author: "Paulo Coelho",
    image: "https://imgs.search.brave.com/okqbyLDQKkT-LMgNKoFB0xkcpkTROEfYWYgMJJGv1DY/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9wbGF6/YWRlbGxpYnJvLmNv/bS9pbWFnZW5lcy85/Nzg2MDczLzk3ODYw/NzMxNTg2MC5HSUY.jpeg",
    status: "Reading",
    id: "123"
  }
]


/* Search book */ 
closeSearchBtn.addEventListener("click", () => {
  searchResultsContainer.classList.add("hidden")
})

closeFormBtn.addEventListener("click", () => {
  bookForm.classList.toggle("hidden")
  myBooksSection.classList.remove("hidden")
})

const showForm = () => {
  reset();
  bookForm.classList.remove("hidden");
  myBooksSection.classList.add("hidden");
}

const checker = () => {
  console.log("working");
}

const editBook = (buttonEl) => {
  const myBookIndex = myBooks.findIndex(
    (item) => item.id === buttonEl.parentElement.parentElement.id);
  
  currentBook = myBooks[myBookIndex]; 

  const { title, author, image, status} = currentBook;
  bookTitle.value = title;
  bookAuthor.value = author;
  bookImage.value = image;
  bookStatus.value = status;

  confirmBook.innerText = "Edit book";

  bookForm.classList.remove("hidden");
  myBooksSection.classList.add("hidden");
  console.log(myBooks)
}

const deleteBook = (buttonEl) => {
  const bookIndex = myBooks.findIndex((item) => item.id === buttonEl.parentElement.parentElement.id);
  myBooks.splice(bookIndex, 1);
  localStorage.setItem("data", JSON.stringify(myBooks));
  updateBookshelf();
}

bookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addOrEditBook(bookTitle.value, bookAuthor.value, bookImage.value, bookStatus.value);
  myBooksSection.classList.remove("hidden");
  bookForm.classList.add("hidden");
})

const addOrEditBook = (title, author, image="default.webp", status="To read") => {
  image = image ? image : "default.webp";
  const myBookIndex = myBooks.findIndex((item) => item.id === currentBook.id) 
  searchResultsContainer.classList.add("hidden");
  if (myBookIndex === -1) {
    myBooks.unshift({
      title: title,
      author: author,
      image: image,
      status: status,
      id: `${title.toLowerCase().split(" ").join("-")}-${Date.now()}`
    })
  } else {
    myBooks[myBookIndex] = {
      title: title,
      author: author,
      image: image,
      status: status,
      id: `${title.toLowerCase().split(" ").join("-")}-${Date.now()}`
    }
  }

  localStorage.setItem("data", JSON.stringify(myBooks))
  updateBookshelf();
  reset();
}

statusRead.addEventListener("click", () => {
  showBooksRead = statusRead.checked ? "Read" : "";
  updateBookshelf();
})

statusReading.addEventListener("click", () => {
  showBooksReading = statusReading.checked ? "Reading" : "";
  updateBookshelf();
})

statusToRead.addEventListener("click", () => {
  showBooksToRead = statusToRead.checked ? "To read" : "";
  updateBookshelf();
})

const updateBookshelf = (booksInOrderToShow = myBooks) => {
  const statusToShow = [showBooksRead, showBooksReading, showBooksToRead];
  bookshelf.innerHTML = "";

  booksInOrderToShow.forEach(({ title, author, image, status, id }) => {
    if (statusToShow.includes(status)) {
      bookshelf.innerHTML += 
      `
        <div class="book" id=${id}>
          <div class="status-section">
            <div class="status-triangle"></div>
            <div class="status">${status}</div>
          </div> 
          <div class="thumbnail">
            <img src="${image}" width="128px" height="200px">
          </div>
          <div class="book-data">
            <h2>${title}</h2>
            <h4>${author}</h4>
            <button type="button" onclick="editBook(this)">Edit</button>
            <button type="button" onclick="deleteBook(this)">Delete</button>
          </div>    
        </div>
      `
    }
  })
}

if (myBooks) {
  updateBookshelf(myBooks);
}

const reset = () => {
  confirmBook.innerText = "Add book";
  bookTitle.value = "";
  bookAuthor.value = "";
  bookStatus.value = "To read";
  bookImage.value = "";
  searchBookInput.value = "";
  searchResultsContainer.innerHTML = "";
  currentBook = {};
}

const displayBooks = (books) => {
  searchResultsContainer.innerHTML = "";
  books.forEach(({ volumeInfo }) => {
    if (!("imageLinks" in volumeInfo)) {
      searchResultsContainer.innerHTML += 
      `
        <div class="card">
          <div class="card-image">
            <img src="default.webp" alt="default image" width="128px" height="210px">
          </div>
          <div class="card-container">
            <p>${ volumeInfo.title }</p>
            <p>By ${ volumeInfo.authors }</p>
          </div>
          <div class="select-book-btn">
            <button type="button" onclick="checker()">Select</button>
          </div>
        </div>      
      `      
    } else {
      if (!("thumbnail" in volumeInfo.imageLinks)) {
        searchResultsContainer.innerHTML += 
        `
          <div class="card">
            <div class="card-image">
              <img src="default.webp" alt="default image">
            </div>
            <div class="card-container">
              <p>${ volumeInfo.title }</p>
              <p>By ${ volumeInfo.authors }</p>
            </div>
            <div class="select-book-btn">
              <button type="button" onclick="checker()">Select</button>
            </div>
          </div>
        `  
      } else {
        searchResultsContainer.innerHTML += 
        `
          <div class="card">
            <div class="card-image">
              <img src="${ volumeInfo.imageLinks.thumbnail }">
            </div>
            <div class="card-container">
              <p>${ volumeInfo.title }</p>
              <p>By ${ volumeInfo.authors }</p>
            </div>
            <div class="select-book-btn">
              <button type="button" onclick="addOrEditBook('${ volumeInfo.title }', '${ volumeInfo.authors }', '${ volumeInfo.imageLinks.thumbnail }')">Select</button>
            </div>
          </div>
        `
      }
    }
  })
}

orderByDropdown.addEventListener("change", (e) => {
  bookshelf.innerHTML = "";

  switch (e.target.value) {
    case "Title":
      updateBookshelf(myBooks.sort((a, b) => {
        if (a.title < b.title) { 
          return -1; 
        }
        if (a.title > b.title) { 
          return 1; 
        }
        return 0;
    }))
      break;
    case "Author":
      updateBookshelf(myBooks.sort((a, b) => {
        if (a.author < b.author) {
          return -1;
        }
        if (a.author > b.author) {
          return 1;
        }
        return 0;
      }))
      break;
    
    default:
      updateBookshelf();
  }
})

searchBookInput.addEventListener("change", () => {
  searchResultsContainer.classList.remove("hidden");
  toSearch = searchBookInput.value;
  searchBookInput.value = "";
  fetch(`https://www.googleapis.com/books/v1/volumes?q=${toSearch}&key=AIzaSyBjRsy_D62Qj4CMPICz0M0tMrkUj8yZ6EU`)
  .then((res) => res.json())
  .then((data) => {   
    displayBooks(data.items.slice(0, 10));
    console.log(data.items.slice(0, 3));
  })
  .catch((err) => {
    console.error(`There was an error: ${err}`);
  });
})