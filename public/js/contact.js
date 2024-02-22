// JavaScript to handle button click and redirect
document.getElementById("createContact").addEventListener("click", function() {
    // Redirect to another page
    window.location.href = "http://localhost:5003/contactPage/createContact";
});

document.getElementById("fetchContacts").addEventListener("click", function() {
    // Redirect to another page
    window.location.href = "http://localhost:5003/contactPage/fetchContacts";
});

document.getElementById("getContact").addEventListener("click", function() {
    // Redirect to another page
    window.location.href = "http://localhost:5003/contactPage/getContact";
});

document.getElementById("updateContact").addEventListener("click", function() {
    // Redirect to another page
    window.location.href = "http://localhost:5003/contactPage/updateContact";
});

document.getElementById("deleteContact").addEventListener("click", function() {
    // Redirect to another page
    window.location.href = "http://localhost:5003/contactPage/deleteContact";
});