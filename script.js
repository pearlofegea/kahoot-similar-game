function joinGame(){
  const username = document.getElementById("username").value;
  const statusDiv = document.getElementById("status");
  if(username.trim() == ""){
    statusDiv.textContent = "Lütfen kullanıcı adını giriniz";
    statusDiv.style.color = "red";

}else{
    statusDiv.textContent = 'Hoşgeldin,${username}! Bekleniyor...';
    statusDiv.style.color = "green";

  }
}