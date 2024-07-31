let users = localStorage.getItem("users")
  ? JSON.parse(localStorage.getItem("users"))
  : [];
let isloggedin = localStorage.getItem("loggedin")
  ? JSON.parse(localStorage.getItem("loggedin"))
  : "";
let loggedInId = "";
if (isloggedin) {
  loggedInId = parseInt(JSON.parse(localStorage.getItem("loggedin")).id);
}
let uploads = localStorage.getItem("uploads")
  ? JSON.parse(localStorage.getItem("uploads"))
  : [];
function validate() {
  //debugger;
  var fullname = document.getElementById("fullname").value;
  var password = document.getElementById("password").value;
  var email = document.getElementById("email").value;
  var confirm_password = document.getElementById("confirm_password").value;

  if (fullname == "") {
    alert("Please enter fullname.");
    return false;
  }
  if (email == "") {
    alert("Please enter email id.");
    return false;
  }
  if (email != "") {
    if (!validateEmail(email)) {
      alert("Please enter valid email id.");
      return false;
    }
    //debugger;
    if (existingEmail(email)) {
      alert("User already exist.");
      return false;
    }
  }
  //debugger;
  if (password == "") {
    alert("Please enter password.");
    return false;
  }
  if (password !== confirm_password) {
    alert("Use same password.");
    return false;
  }

  var users = localStorage.getItem("users")
    ? JSON.parse(localStorage.getItem("users"))
    : [];
  var user = {
    id: Number(new Date()),
    fullname: fullname,
    email: email,
    password: password,
  };

  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
  user.isloggedin = true;
  localStorage.setItem("loggedin", JSON.stringify(user));
  return true;
}

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

const existingEmail = (email) => {
  let allUsers = localStorage.getItem("users")
    ? JSON.parse(localStorage.getItem("users"))
    : [];
  if (allUsers.length > 0) {
    for (let i = 0; i < allUsers.length; i++) {
      if (allUsers[i].email.trim() == email.trim()) {
        return true;
      } else {
        return false;
      }
    }
  } else {
    return false;
  }
};

function login() {
  var password = document.getElementById("password").value;
  var email = document.getElementById("email").value;
  if (email == "") {
    alert("Please enter email id.");
    return false;
  }
  if (email != "") {
    if (!validateEmail(email)) {
      alert("Please enter valid email id.");
      return false;
    }
  }
  if (password == "") {
    alert("Please enter password.");
    return false;
  }

  let status = false;
  const loggedin = users.find((result) => {
    if (result.email == email && result.password == password) {
      result.isloggedin = true;
      localStorage.setItem("loggedin", JSON.stringify(result));
      status = true;
    }
  });
  if (!status) {
    alert("Wrong Email or Password.");
    return false;
  }
}

function edit() {
  let fullname = document.getElementById("fullname").value;
  let email = document.getElementById("email").value;
  if (fullname == "") {
    alert("Please enter fullname.");
    return false;
  }
  if (email == "") {
    alert("Please enter email id.");
    return false;
  }
  let userId = parseInt(document.getElementById("user_id").value);
  let editIndex = users.findIndex((result) => result.id === userId);
  users[editIndex].fullname = fullname;
  localStorage.setItem("users", JSON.stringify(users));
  return true;
}

function deleteUser(id) {
  //alert(id);
  const confirmed = confirm("Are you sure?");
  if (confirmed) {
    let restUsers = users.filter((result) => result.id !== parseInt(id));
    //console.log(restUsers);
    localStorage.setItem("users", JSON.stringify(restUsers));
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const myModalEl = new bootstrap.Modal(
    document.getElementById("exampleModal")
  );
  const deleteModalEl = new bootstrap.Modal(
    document.getElementById("deleteModal")
  );

  saveDocument = () => {
    let fileDescription = document.getElementById("file_description").value;
    let fileData = document.getElementById("filename");
    let uploadId = document.getElementById("upload_id").value;
    let filename = "";
    if (fileData.files.length) {
      filename = fileData.files.item(0).name;
      document.getElementById("hidden_filename").value = filename;
    } else {
      filename = document.getElementById("hidden_filename").value;
    }
    if (fileDescription == "") {
      alert("Please enter file description.");
      return false;
    }
    if (filename == "") {
      alert("Please choose file.");
      return false;
    }
    if (uploadId != "") {
      let updateIndex = uploads.findIndex(
        (result) => result.id === parseInt(uploadId)
      );
      uploads[updateIndex].label = fileDescription;
      if (filename != "") {
        uploads[updateIndex].filename = filename;
      }
      console.log({ uploads });
    } else {
      let upload = {
        id: Number(new Date()),
        label: fileDescription,
        filename: filename,
      };
      uploads.push(upload);
    }

    localStorage.setItem("uploads", JSON.stringify(uploads));
    setHtmlContent();

    let documentForm = document.getElementById("documentForm");
    if (documentForm) {
      documentForm.reset(); // Clear form fields
      document.getElementById("upload_id").value = "";
      document.getElementById("document-btn").textContent = "Upload Now";
    }
    myModalEl.hide();
    return true;
  };

  /*edit document */
  editDocument = (uploadId) => {
    let editUpload = uploads.find((result) => result.id == parseInt(uploadId));
    let { id, label, filename } = editUpload;
    document.getElementById("file_description").value = label;
    document.getElementById("hidden_filename").value = filename;
    document.getElementById("upload_id").value = id;
    document.getElementById("document-btn").textContent = "Save";
    myModalEl.show();
  };

  deleteUpload = () => {
    let uploadId = document.getElementById("delete_id").value;
    let restUploads = uploads.filter(
      (result) => result.id !== parseInt(uploadId)
    );
    localStorage.setItem("uploads", JSON.stringify(restUploads));
    setHtmlContent();
    deleteModalEl.hide();
    window.location.href = "./documentList.html";
    return true;
  };

  deleteDocument = (uploadId) => {
    document.getElementById("delete_id").value = uploadId;
    deleteModalEl.show();
  };
});
setHtmlContent = () => {
  let htmlContent = "";
  if (uploads) {
    for (let i = 0; i < uploads.length; i++) {
      htmlContent += `<tr class=''>
                                <td scope='row'>${uploads[i].label}</td>
                                <td scope='row'>${uploads[i].filename}</td>
                                <td scope='row'>
                                <a onclick="return editDocument(${uploads[i].id});">  Edit </a>| 
                                <a onclick="return deleteDocument(${uploads[i].id});">  Delete </a> </td>
                            </tr>`;
    }
  }
  document.getElementById("document-list").innerHTML = htmlContent;
};
function logout() {
  localStorage.removeItem("loggedin");
  window.location.href = "./logout.html"; // Redirect to logout page
}
