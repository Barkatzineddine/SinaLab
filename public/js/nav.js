const sidebar = document.querySelector(".sidebar");
  const closeBtn = document.querySelector("#btn");
 const nameJob = document.querySelector(".name_job")
 const navList = document.querySelector(".nav-list")

  closeBtn.addEventListener("click", ()=>{
    sidebar.classList.toggle("open");
    menuBtnChange();//calling the function(optional)
  });



  // following are the code to change sidebar button(optional)
  function menuBtnChange() {
   if(sidebar.classList.contains("open")){
    navList.classList.replace("nav-list","links")
      nameJob.classList.remove("name_jobs")
     closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");//replacing the iocns class
   }else {
    navList.classList.replace("links","nav-list")
    nameJob.classList.add("name_jobs")
     closeBtn.classList.replace("bx-menu-alt-right","bx-menu");//replacing the iocns class
   }
  }